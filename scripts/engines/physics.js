// TODO: Much later, add tire slip (by faking loss if launching at higher rpm than optimal, and calculate loss using magic formula)
// TODO: Implement setters and getters, make things that should be private private, and change the way
//		 the run class interacts with the frontend to fit with the new changes
class Engine {
    constructor(data) {
        this.idle_RPM = data["idle_RPM"];
        this.redline = data["redline"];
        this.forced_induction = data["forced_induction"];
        this.flat_turbo = data["flat_turbo"];
        this.spool_speed = data["spool_speed"];
        this.max_torque = data["max_torque"];
        this.coefficients = [
            data["coefficient_0"],
            data["coefficient_1"],
            data["coefficient_2"],
            data["coefficient_3"],
            data["coefficient_4"],
            data["coefficient_5"],
            data["coefficient_6"],
            data["coefficient_7"],
            data["coefficient_8"]
        ];
        this.blow_off = data["blow_off"];

    }
}

class Transmission {
    constructor(data) {
        this.drive = data["drive"];
        this.final_drive = data["final_drive"];
        this.gear_1 = data["gear_1"];
        this.gear_2 = data["gear_2"];
        this.gear_3 = data["gear_3"];
        this.gear_4 = data["gear_4"];
        this.gear_5 = data["gear_5"];
        this.gear_6 = data["gear_6"];
        this.gear_7 = data["gear_7"];
        this.gear_8 = data["gear_8"];
        this.gear_9 = data["gear_9"];
        this.max_gear = data["max_gear"];
        this.gear = [
            this.gear_1,
            this.gear_2,
            this.gear_3,
            this.gear_4,
            this.gear_5,
            this.gear_6,
            this.gear_7,
            this.gear_8,
            this.gear_9,
        ];
        this.shift_delay_coefficient = data["shift_delay_coefficient"];
        this.shift_earlier = data["shift_earlier"];
        this.flywheel_coefficient = data["flywheel_coefficient"];
        this.drive_efficiency = data["drive_efficiency"];
        this.lsd = data["lsd"];
        this.straight_cut = data["straight_cut"];
    }
}

class Chassis {
    constructor(data) {
        this.weight = data["weight"] + 90; // adding driver and fuel
        this.rear_weight = data["rear_weight"];
        this.c_d = data["c_d"];
        this.frontal = data["frontal"];
        this.df_coeff = data["df_coeff"];
        this.wheel_radius = data["wheel_radius"];
        this.tyre_coeff = data["tyre_coeff"];
        this.cm_height = data["cm_height"];
        this.wheelbase = data["wheelbase"];
    }
}

class Car {
    //TODO: implement electric car

    constructor(name) {
        this.name = name;
        this.data = cars.find((car) => car.name === name);
        this.engine = new Engine(this.data);
        this.chassis = new Chassis(this.data);
        this.transmission = new Transmission(this.data);

        //sounds
        this.has_sound = true;
        this.sound_url = `./assets/engine_sounds/${this.name}.mp3`;

        try {
            this.sound_pitch_0 = this.data["sound_pitch_0"];
            this.sound_pitch_1 = this.data["sound_pitch_1"];
        } catch (error) {
            console.error(`Error fetching sound pitch data for ${this.name}:`, error);
            this.has_sound = false;
        }

    }

    torque(N) {
        let coefficients = this.engine.coefficients;
        let [v, w, a, b, c, d, e, f, g] = [
            coefficients[8],
            coefficients[7],
            coefficients[6],
            coefficients[5],
            coefficients[4],
            coefficients[3],
            coefficients[2],
            coefficients[1],
            coefficients[0],
        ];

        let poly =
            v * Math.pow(N, 8) +
            w * Math.pow(N, 7) +
            a * Math.pow(N, 6) +
            b * Math.pow(N, 5) +
            c * Math.pow(N, 4) +
            d * Math.pow(N, 3) +
            e * Math.pow(N, 2) +
            f * N +
            g;

        if (this.engine.flat_turbo) {
            return Math.min(poly, this.engine.max_torque);
        }

        if (poly < 0) {
            console.warn("Torque is negative. Clamping...");
            return Math.max(1, Math.min(N, this.engine.max_torque));
        }
        if (this.engine.redline <= N) return 0;
        //console.log("Torque at engine rpm " + N + " is " + poly);
        return poly;
    }
}

class Run {
    launch_RPM = 4000;
    gear_index = 0;
    current_rpm = 1000;

    current_seconds = 0;
    end = 80; //run duration in s
    max_steps = this.end * TARGET_FPS;
    step = this.end / this.max_steps;
    iter_index = 0;
    time = linspace(0, this.end, this.max_steps); //s

    accel = 0; //current acceleration in m/s^2
    current_speed = 0;
    speed = new Array(this.max_steps).fill(0);
    current_wheel_speed = 0;
    wheel_speed = new Array(this.max_steps).fill(0);
    current_distance = 0;

    //
    shift_call = false; // becomes True when PLAYER shifts, gets used to change gear and becomes false again
    shifting = false; // if car is in shifting mode (clutched in)
    stututu = false; // becomes true for a moment after a successful shift or let off the gas
    shift_iter_indexs_left = 0; // iter_indexations left until shifting is complete
    clutch_extra_revs = 0;
    spool_loss = 1; //e.g. 0.7 means u can use 70% of the max torque

    shift_points;
    best_rpm = 4000;

    spinning = false;
    optimal_slip = 0.10052;
    allowed_slip = 0.10052;

    //times
    to_100km = '';
    to_400m = '';
    to_800m = '';

    //state
    done = false;

    // test force store
    ground_force = 0;
    torque_at_wheel = 0;
    //sounds

    constructor(car, is_player) {
        this.car = car;
        this.is_player = is_player;

        this.shift_points = new Array(this.car.transmission.max_gear - 1).fill(0);
        this.compute_shift_points();
    }

    get_best_rpm() {
        let max_torque = 0;
        this.best_rpm = 4000;
        for (let curr_rpm = 1100; curr_rpm <= this.car.engine.redline; curr_rpm += 100) {
            let torque_new = this.car.torque(curr_rpm);
            if (torque_new > max_torque) this.best_rpm = curr_rpm;
        }
        return this.best_rpm;
    }

    compute_shift_points() {
        const redline = this.car.engine.redline;
        const idle = this.car.engine.idle_RPM;

        for (let gear = 0; gear <= this.car.transmission.max_gear - 1; gear++) {
            this.shift_points[gear] = this.car.engine.redline; //default at redline rpm.

            for (let curr_rpm = redline; curr_rpm >= idle; curr_rpm -= 100) {
                let curr_speed = this.get_current_speed(curr_rpm, gear);
                let rpm_next_gear = this.compute_RPM_for_shift_points(curr_speed, gear + 1);

                let torque_wheels_next = this.torque_at_wheel_axis(rpm_next_gear, gear + 1);
                let torque_wheels_curr = this.torque_at_wheel_axis(curr_rpm, gear);

                if (gear === 3) {
                    console.log('torque_wheels_cur with gear 0 and rpm ' + curr_rpm + ' ' + torque_wheels_curr);
                    console.log('next rpm = ' + rpm_next_gear);
                    console.log('torque_wheels_next = ' + torque_wheels_next);
                }

                if (torque_wheels_curr <= torque_wheels_next) {
                    this.shift_points[gear] = curr_rpm;
                }
            }
        }

        console.log('Shift points calculated = ' + this.shift_points);
    }

    compute_RPM_for_shift_points(speed, gear) {
        let final_drive = this.car.transmission.final_drive;
        let wheel_radius = this.car.chassis.wheel_radius;
        let current_gear_ratio = this.car.transmission.gear[gear];
        let rpm =
            (speed * 30 * current_gear_ratio * final_drive) /
            (Math.PI * wheel_radius);
        return rpm;
    }



    /**
     * only used in computing shift points
     */
    get_current_speed(rpm, gear_index) {
        const gear_ratio = this.car.transmission.gear[gear_index];
        const final_ratio = this.car.transmission.final_drive;
        return (rpm * Math.PI * this.car.chassis.wheel_radius) / (gear_ratio * final_ratio * 30);
    }

    get_shift_points() {
        return this.shift_points;
    }

    stututu_done() {
        this.stututu = false;
    }

    shift() {
        this.shift_call = true;
    }

    rev() {
        let increment = 50 + this.car.torque(this.current_rpm) ** 0.8;
        this.current_rpm = Math.min(this.current_rpm + increment, this.car.engine.redline - 1);
        this.jump_off_redline(); // only runs if at redline
    }

    off_throttle() {
        let decrement = this.car.engine.redline / 100 * 1.1 + this.car.transmission.flywheel_coefficient * 5;
        this.current_rpm = Math.max(this.current_rpm - decrement, this.car.engine.idle_RPM);
    }

    update_seconds(iter_index) {
        this.current_seconds = this.time[iter_index];
    }

    /**
     * @param speed
     * @returns downforce in N
     */
    downforce(speed) {
        let df_coeff = this.car.chassis.df_coeff;
        let result = df_coeff * (speed ** 2);

        if (speed > 55.4 && speed < 55.6) console.log("downforce at 200kmh = " + result / 9.81 + 'kg');
        if (speed > 69.3 && speed < 69.5) console.log("downforce at 250kmh = " + result / 9.81 + 'kg');

        return result;

    }

    /**
     * @param speed
     * @returns {number} vertical load on all tires in Newtons
     */
    vertical_load(speed) {
        let weight = this.car.chassis.weight * 9.81;//convert to Newtons
        let downforce = this.downforce(speed); // N
        let result = weight + downforce; //N

        if (speed > 55.4 && speed < 55.6) console.log("load at 200kmh = " + result / 9.81 + 'kg');
        if (speed > 69.3 && speed < 69.5) console.log("load at 250kmh = " + result / 9.81 + 'kg');

        if (speed > 0) {
            return result;
        } else {
            return weight;
        }
    }

    /**
     *
     * @param accel
     * @returns {number} The pct (from 0 to 1) of weight on driving wheels
     */
    weight_transfer() {
        let drive = this.car.transmission.drive;
        let rear_weight = this.car.chassis.rear_weight;
        let front_weight = 1 - rear_weight;
        let A, B, C;
        let cm_height = this.car.chassis.cm_height;
        let wheelbase = this.car.chassis.wheelbase;
        let result;

        if (drive === 1) {
            // fwd
            A = 0;
            B = 1;
            C = -1;
        } else if (drive === 0) {
            // awd
            A = 1;
            B = 1;
            C = 0;
        } else if (drive === -1) {
            // rwd
            A = 1;
            B = 0;
            C = 1;
        }

        result =
            A * rear_weight +
            B * front_weight +
            C * ((cm_height * this.accel) / wheelbase);
        return result;
    }

    torque_at_wheel_axis(N, gear_index) {
        let engine_torque = this.car.torque(N);
        let gear = this.car.transmission.gear;
        let drive_efficiency = this.car.transmission.drive_efficiency;
        let final_drive = this.car.transmission.final_drive;

        let crank_torque = engine_torque * this.spool_loss;
        let result = drive_efficiency * crank_torque * gear[gear_index] * final_drive;

        if (result < 0) {
            console.warn("Torque at wheel axis is negative.");
            console.log("input rpm was " + N);
            console.log("engine torque was " + engine_torque);
        }

        return result;
    }

    force_at_ground(N, gear_index, car_speed) {
        let redline = this.car.engine.redline;
        if (N >= redline) return 0;

        let tyre_coeff = this.car.chassis.tyre_coeff;
        let weight_transfer = this.weight_transfer();
        let wheel_radius = this.car.chassis.wheel_radius;

        let Fz = weight_transfer * this.vertical_load(car_speed);//weight * 9.81; // load on driving tyres
        //let max_force = tyre_coeff * Fz//(Fz ** 0.995);
        let k = this.get_slip_ratio(car_speed);
        const a = 18.01
        //let magic_formula_sin = Math.max(Math.sin(1.9 * Math.atan(10 * (k) - 0.97 * (10 * (k) - Math.atan(10 * (k))))), 0.1);
        let magic_formula_sin = Math.sin(1.9 * Math.atan(a * (k) - 0.97 * (a * (k) - Math.atan(a * (k)))));
        console.log('magic formula sin = ', magic_formula_sin);
        console.log('k =', k);
        console.log('curr rrpm = ', this.current_rpm);
        let max_force = tyre_coeff * Fz * magic_formula_sin;
        let result = Math.min(this.torque_at_wheel / wheel_radius, max_force);

        if (k > 0.026) {
            this.spinning = true;
        } else {
            this.spinning = false;
        }

        if (result < 0) {
            console.warn("Force at ground is negative.");
            console.log("max force was " + max_force);
        }

        console.log(`Force at ground = ${result}, force at wheels = ${this.torque_at_wheel / wheel_radius}, rpm = ${N}`);
        return result;
    }

    wheel_aero_drag(speed) {
        return 2 * 0.00028 * (speed ** 2);
        // approximately the aero drag of 2 16 inch tires
    }

    drag(speed) {
        let c_d = this.car.chassis.c_d;
        let frontal_area = this.car.chassis.frontal;
        let wheel_aero_drag = this.wheel_aero_drag(speed);
        return 0.5 * c_d * frontal_area * 1.204 * (speed ** 2) + wheel_aero_drag;
    }

    roll_resistance(speed) {
        if (speed > 0.01) {
            let Zalpha = this.vertical_load(speed) ** 1.034; //N^...
            let Pbeta = 230.632 ** (-0.4108); //kpa ^ ...
            let a = 0.05933;
            let b = 9.855e-5;
            let c = 3.7231e-7;
            //

            let result = Zalpha * Pbeta * (a + b * (speed * 3.6) + c * (speed * 3.6) ** 2); //  SAE standard J2452 - (177,253)
            //let result = this.vertical_load(speed) * (1e-2 + 5e-7 * speed / 3.6 + 2e-7 * ((speed / 3.6) ** 2)) // (194, 272)
            //let result = (0.005 + (1 / 2.5) * (1e-2 + 0.0095 * (speed / (3.6 * 100)) ** 2)) * this.vertical_load(speed); // (176, 249)

            if (speed > 69.3 && speed < 69.5) console.log("ROLLING RESISTANCE at 250kmh = " + result + 'N');
            if (speed > 110.9 && speed < 111.2) console.log("ROLLING RESISTANCE at 400kmh = " + result + 'N');

            return result;
        } else {
            return 0;
        }
    }

    /**
     * du/dt = f, the derivative of speed in newton's equation.
     * It is the sum of forces divided by mass.
     * @param t
     * @param speed
     * @param N
     */
    f(t, speed, N) {
        let Fg = this.ground_force;
        let Fdrag = this.drag(speed);
        let Froll = this.roll_resistance(speed);
        let Fnet = Fg - Fdrag - Froll;
        let result = Fnet / this.car.chassis.weight;

        if (result > 0) {
            /*
            console.log("speed = " + speed);
            console.log("N = " + N);
            console.log("Fground = " + Fg);
            console.log("Fdrag = " + Fdrag);
            console.log("Froll = " + Froll);*/
            return result;
        } else {
            console.warn("Net force not positive. Value = " + result);
            console.log("speed = " + speed);
            console.log("N = " + N);
            console.log("Fground = " + Fg);
            console.log("Fdrag = " + Fdrag);
            console.log("Froll = " + Froll);
            return 0.01;
        }
    }

    /**
     * find engine speed from wheel speed and gear index
     * @param speed
     */
    compute_RPM(wheel_speed, gear) {
        let final_drive = this.car.transmission.final_drive;
        let wheel_radius = this.car.chassis.wheel_radius;
        let current_gear_ratio = this.car.transmission.gear[gear];
        let rpm =
            (wheel_speed * 30 * current_gear_ratio * final_drive) /
            (Math.PI * wheel_radius);

        if (rpm < this.car.engine.idle_RPM || rpm > this.car.engine.redline) {
            console.warn("RPM " + rpm + " out of range for car with redline " + this.car.engine.redline);
            console.log("speed = " + speed);
        }

        console.log(`raw rpm from wheelspeed = ${wheel_speed * 3.6} is ${rpm}`);

        if (this.gear_index === 0) {
            // in 1st gear, use launch rpm until wheel speed asks for more rpm

            /*
            let rng = Math.floor(Math.random() * 251); // random between 0 and 250
            rpm = Math.max(rpm - rng, this.launch_RPM);*/

            // slowly transition to real rpm
            let delta = (this.launch_RPM - rpm);
            if (delta > 100) rpm = this.launch_RPM - delta / 10;

        }
        // find the rpm for the next time step


        return rpm + this.clutch_extra_revs;
    }

    get_max_speed_at_gear() {
        let final_drive = this.car.transmission.final_drive;
        let wheel_radius = this.car.chassis.wheel_radius;
        let redline = this.car.engine.redline;
        let current_gear_ratio = this.car.transmission.gear[this.gear_index];

        return (
            (Math.PI * wheel_radius * redline) /
            (30 * final_drive * current_gear_ratio)
        );
    }

    compute_wheel_speed(i) {
        //if this.shifting/??????
        let wheel_radius = this.car.chassis.wheel_radius;
        this.torque_at_wheel = this.torque_at_wheel_axis(this.current_rpm, this.gear_index);
        this.ground_force = this.force_at_ground(this.current_rpm, this.gear_index, this.speed[i - 1]);

        const acceleration = (this.torque_at_wheel - this.ground_force * wheel_radius) / 2.25;
        const new_wheel_speed = this.wheel_speed[i - 1] + this.step * acceleration;

        const upper_bound = Math.min(this.get_max_speed_at_gear(this.gear_index), (1 + this.allowed_slip) * Math.max(this.speed[i - 1], 1)) / wheel_radius;
        this.wheel_speed[i] = Math.min(new_wheel_speed, upper_bound);
        this.current_wheel_speed = this.wheel_speed[i] * wheel_radius;

        console.log(`old rpm = ${this.current_rpm}`);
        this.current_rpm = this.compute_RPM(this.current_wheel_speed, this.gear_index);
        console.log(`new rpm = ${this.current_rpm}`);

    }

    get_slip_ratio(car_speed) {
        //const result = (this.current_wheel_speed - this.current_speed) / Math.max(this.current_speed, 0.01);
        const result = (this.current_wheel_speed - car_speed) / Math.max(car_speed, 0.01);
        return Math.min(result, this.allowed_slip); // allow some wheelspin
        //return result;
        //optimal for a = 18.01: slip = 0.100052
        //return Math.min(result, 0.100052);
    }

    simulate_step() {
        if (this.iter_index === 0) this.load_launch_rpm(); //if launching

        this.iter_index++;
        let i = this.iter_index;
        if (i === this.max_steps) {
            console.log("Max steps reached, finishing simulation...");
            this.done = true;
            return;
        }
        this.update_seconds(i);
        this.distance_calculations();
        this.update_times();

        let has_spool =
            this.car.engine.forced_induction === 1 ||
            this.car.engine.forced_induction === 2;

        if (has_spool && this.spool_loss < 1) {
            this.spool_loss = Math.min(
                1,
                this.spool_loss + this.car.engine.spool_speed
            );
        }

        if (this.shifting) {
            //if clutched in
            this.drop_RPM(i);
            if (this.shift_iter_indexs_left <= 0) this.release_clutch(i);
            return;
        } else {
            if (i === 1) console.log(`curr rpm = ${this.current_rpm}`);
            this.compute_wheel_speed(i);
            this.vroom(i);
            this.shifting_logic();
            return;
        }
    }

    vroom(i) {
        //console.log("vroom: " + i);
        // find the next speed for the simulation
        let Euler_solution =
            this.speed[i - 1] +
            this.step *
            this.f(this.time[i - 1], this.speed[i - 1], this.current_rpm);
        let max_speed_at_current_gear = this.get_max_speed_at_gear();
        this.speed[i] = Math.max(
            0.01,
            Math.min(Euler_solution, max_speed_at_current_gear)
        );
        this.current_speed = this.speed[i];
        this.compute_acceleration(i);
        //console.log("euler: ", this.speed[i]);

        this.clutch_extra_revs = Math.max(
            0,
            this.clutch_extra_revs - 20
        );


        //INFO: This penalizes very high rpm launches:
        //  The force on ground is determined by torque at engine,
        //  and it usually falls off at low rpm. The above formula keeps
        //  the car at the launch rpm until the actual calculated rpm
        //  based on speed reaches the launch rpm, so the car will be
        //  stuck at the launch torque, and in some cases it doesnt
        //  reach the max power it could have put down, therefore losing
        //  time. Very low rpm launches are also penalized, since its
        //  possible that the maximum torque of the tires isnt reached.

        //console.log("updating rpm to " + this.current_rpm);
        //TODO: add a countdown to slowly transition to N_new.
        // If this is added, it will minimize the high rpm launch penalty, read above.
        //this.current_rpm = max(N_new, 5000 + (-1)**random.randint(0,1) * random.randint(50,150))
    }// else {
    // If not in 1st gear just update rpm
    //this.current_rpm = N_new;
    //console.log("not in 1st gear. updating rpm to " + this.current_rpm);

    //}


    /**
     * determines whether the car will shift gear or jump off the redline
     */
    shifting_logic() {
        let can_shift_gear = this.gear_index < this.car.transmission.max_gear;

        let too_early = this.current_rpm < 3500;

        let possible_shift = can_shift_gear && !too_early ? true : false;

        let player_pressed_to_shift = this.is_player && this.shift_call;

        let bot_satisfied_conditions =
            !this.is_player &&
            this.current_rpm >=
            this.car.engine.redline -
            50 -
            this.car.transmission.shift_earlier;

        if (
            (player_pressed_to_shift || bot_satisfied_conditions) &&
            possible_shift
        ) {
            this.begin_shifting_process();
        } else {
            this.jump_off_redline();
        }
    }

    jump_off_redline() {
        if (this.car.engine.redline - this.current_rpm < 10) {
            let rng = Math.floor(Math.random() * (51)) + 10;
            this.current_rpm -= rng;//rng;
        }
    }

    /**
     * Checks if player can shift.
     * If yes, fills the shift_iter_indexs_left, increases gear index,
     * updates this.shifting to true, and calculates turbo spool loss and
     * extra revs for when the clutch will be released.
     */
    begin_shifting_process() {
        this.shifting = true;
        this.stututu = true;
        this.shift_iter_indexs_left =
            (this.car.transmission.shift_delay_coefficient + 1) * (TARGET_FPS / 40);
        this.gear_index += 1; //shift to next gear
        //console.log("gear =", this.gear_index + 1);

        // turbo spool losses and clutch rpm after shifting
        this.clutch_extra_revs =
            (160 * this.car.transmission.shift_delay_coefficient) / ((this.gear_index ** 1.5 + 2));


        if (this.car.engine.forced_induction == 1) {
            this.spool_loss = 0.4;
        }

        this.shift_call = false;
    }

    update_times() {
        if (this.to_100km === '' && this.current_speed >= 27.777) {
            this.to_100km = this.current_seconds.toFixed(1);
        }
    }
    compute_acceleration(i) {
        // acceleration in G's
        let delta_u = this.speed[i] - this.speed[i - 1];
        let delta_t = this.step;
        this.accel = delta_u / (delta_t * 9.81); // in G
    }

    drop_RPM(i) {
        this.speed[i] = this.speed[i - 1] - 0.01;
        this.wheel_speed[i] = this.wheel_speed[i - 1] - 0.02;
        this.current_speed = this.speed[i];
        this.current_rpm -= 100 * this.car.transmission.flywheel_coefficient / (TARGET_FPS / 40); // rpm drop each step
        this.shift_iter_indexs_left -= 1;
        return;
    }

    release_clutch(i) {
        this.shifting = false; // release clutch
        this.speed[i] += 0.05; // jolt when clutch is released
        this.current_rpm = this.compute_RPM(this.wheel_speed[i - 1] * this.car.chassis.wheel_radius, this.gear_index);
    }

    distance_calculations() {
        // distance calculations
        this.current_distance +=
            this.current_speed *
            (this.current_seconds - this.time[this.iter_index - 1]);
        if (Math.abs(this.current_distance - 400) < 1) {
            console.log("0-400m in " + this.current_seconds);
            this.to_400m = this.current_seconds;
        }
        if (Math.abs(this.current_distance - 800) < 2) {
            console.log("0-800m in " + this.current_seconds);
            this.to_800m = this.current_seconds;
        }
    }

    load_launch_rpm() {
        console.log('loading launch rpm');
        this.launch_RPM = this.current_rpm;
        if (!this.is_player) this.launch_RPM = 4500;
    }
}

// Example usage:
//let car = new Car("2013_Peugeot_208_GTI");
//let car = new Car("Citroen_Saxo_VTS_Custom");
//let run = new Run(car, true);
// you begin by running simulate_step in a loop
