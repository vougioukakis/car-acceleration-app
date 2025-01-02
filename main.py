# imports
import numpy as np
import matplotlib
import matplotlib.pyplot as plt
import random
import pandas as pd
import librosa
import array
from matplotlib.backends.backend_pdf import PdfPages
plt.ioff()
import sys

from quart import Quart, render_template, request, jsonify
     
"""
@app.route("/simulation/action", methods=["POST"])
def take_action(action: str):
    # Process actions like gear shift or acceleration
    if action == "shift":
        simulation.shift()
    return {"status": "success"}
"""

manual = 1
fps = 30
def make_engine_curve(points):
    # Points (x, y)
    points = np.array(points)

    # Extract x and y coordinates
    x = points[:, 0]
    y = points[:, 1]

    # Degree of the polynomial
    n = len(points) - 1

    # Fit the polynomial
    coefficients = np.polyfit(x, y, n)

    # Create the polynomial function
    poly_function = np.poly1d(coefficients)

    # Print the polynomial coefficients
    print(f'The polynomial coefficients are: {coefficients}')

    # Generate x values for plotting the fitted polynomial
    x_vals = np.linspace(min(x), max(x), 1000)
    y_vals = poly_function(x_vals)

    # Plot the points and the fitted polynomial
    plt.scatter(x, y, color='red', label='Data Points')
    plt.plot(x_vals, y_vals, label='Fitted Polynomial')
    plt.xlabel('x')
    plt.ylabel('y')
    plt.legend()
    plt.show()

    return coefficients

class Car:
    def __init__(self, car_name, data_df):
        """
        -car_name : string
        -data_df : pd.DataFrame.
        """
        self.name = car_name
        car_data = data_df[data_df['name'] == car_name]
        if car_data.empty:
            raise ValueError(f"Car '{car_name}' not found in the dataset.")
        
        car_data = car_data.squeeze()  # Convert the DataFrame row to a Series
        
        self.weight = car_data['weight'] + 75 # plus driver weight
        self.rear_weight = car_data['rear_weight'] # % of weight on the rear
        self.c_d = car_data['c_d'] # drag coefficient
        self.frontal = car_data['frontal'] # m^2
        self.df_coeff = car_data['df_coeff']
        self.wheel_radius = car_data['wheel_radius'] # in m
        self.tyre_coeff = car_data['tyre_coeff'] # 1 for normal sports tires but also take into account other factors like differential
                                                # 0.8-0.9 for old or cheap tire
                                                # 1.3 for hypercar tyres
                                                # 1.3-1.5 for slicks
                                                # ~1.6 for drag tires
        self.cm_height = car_data['cm_height']
        self.wheelbase = car_data['wheelbase']

        self.drive = car_data['drive']
        self.final_drive = car_data['final_drive']
        self.gear_1 = car_data['gear_1']
        self.gear_2 = car_data['gear_2']
        self.gear_3 = car_data['gear_3']
        self.gear_4 = car_data['gear_4']
        self.gear_5 = car_data['gear_5']
        self.gear_6 = car_data['gear_6']
        self.gear_7 = car_data['gear_7']
        self.gear_8 = car_data['gear_8']
        self.gear_9 = car_data['gear_9']
        self.max_gear = car_data['max_gear']
        self.gear = [self.gear_1, self.gear_2, self.gear_3, self.gear_4, self.gear_5,
                     self.gear_6, self.gear_7, self.gear_8, self.gear_9]
        self.idle_RPM = car_data['idle_RPM']
        self.shift_delay_coefficient = car_data['shift_delay_coefficient'] # int. 1 = f1 level,... 8 = normal, 15 = grandma
        self.shift_earlier = car_data['shift_earlier'] # rpm by which to shift earlier than redline when on auto
        self.flywheel_coefficient = car_data['flywheel_coefficient'] # in [0.2, 0.8], larger values drop rpm faster when shifting
        self.drive_efficiency = car_data['drive_efficiency'] # between 0.8 and 0.9
        self.redline = car_data['redline'] 
        self.forced_induction = car_data['forced_induction'] # 0 = na, 1=singleTurbo, 2=twoTurbos, 3=SC/Compressor, 4=rocket
        self.flat_turbo = car_data['flat_turbo'] # modern torque control for a flat curve at peak torque
        self.spool_speed = car_data['spool_speed'] # how fast the turbo spools up
        self.blow_off = car_data['blow_off'] # which blow off valve sound. 0 = none, 1 = pshhhh -no spool, 2 = stututu - spool, 3 = psssh - spool
        self.max_torque = car_data['max_torque'] # only used for flat_turbo = 1
        self.electric = car_data['electric'] # probably useless
        self.coefficients = [car_data[f'coefficient_{i}'] for i in range(8)] # torque curve polynomial coefficients

    def get_name(self):
        return self.name
    def torque(self, N):
        w = self.coefficients[7]
        a = self.coefficients[6]
        b = self.coefficients[5]
        c = self.coefficients[4]
        d = self.coefficients[3]
        e = self.coefficients[2]
        f = self.coefficients[1]
        g = self.coefficients[0]
        poly = lambda N: w*N**7 + a*N**6 + b*N**5 + c*N**4 + d*N**3 + e*N**2 + f*N + g

        #if N < self.idle_RPM or N > self.redline:
            #print("\nWarning in Car.torque: rpm not within limits.")
        if self.flat_turbo:
            return min(poly(N), self.max_torque)
        if poly(N) < 0:
            print("\nWarning in Car.torque: torque is negative.")
            print("\t input rpm = ", N)
            print("\t clamping torque...")
            return max(1, min(N, self.max_torque))

        return poly(N)
            
    def plot_torque(self):
        N = np.linspace(0, self.redline, 100000)
        torque_vals = [self.torque(n) for n in N]
        plt.plot(N, torque_vals)
        plt.show()

class Run:
    def __init__(self, car: Car, who : int):
        self.who = who # 0,1 , player = 0, bot = 1
        self.accel = 0. # current acceleration in m/s^2
        self.car = car
        self.launch_RPM = 5000#car.idle_RPM

        self.gear_index = 0
        self.current_speed = 0.
        self.current_distance = 0.
        self.current_rpm = 5000#self.car.idle_RPM
        self.end = 70 #s
        self.max_steps = self.end * fps
        self.time = np.linspace(0,self.end,self.max_steps) # s
        self.step = self.end/self.max_steps
        self.current_seconds = 0.
        self.iter_index = 0 # the index for the self.speed and self.time arrays
        self.speed = np.zeros(self.max_steps) # m/s
    
        self.shift_call = False; # becomes True when PLAYER shifts, gets used to change gear and becomes false again
        self.shifting = False # if car is in shifting mode (clutched in)
        self.stututu = False # becomes true for a moment after a successful shift or let off the gas
                            # CarSound class makes it false again once turbo sounds play
        self.shift_iter_indexs_left = 0. # iter_indexations left until shifting is complete
        self.clutch_extra_revs = 0
        self.spool_loss = 1. # e.g. 0.7 means u can use 70% of the max torque
        self.spinning = False

        """
        self.cache = {}
        self.cache['N'] = np.zeros(self.max_steps)
        self.cache['tire_forces'] = np.zeros(self.max_steps)
        self.cache['torque_at_wheel'] = []
        self.cache['crank_torque']= []
        self.cache['gears'] = np.zeros(self.max_steps)"""

    def show_accel_times(self):
        if self.who == 0:
            self.show_time_to(100)
            self.show_time_to(160)
            self.show_time_to(200)
            self.show_time_to(240)
            self.show_time_to(300)
            self.show_time_to(320)

            print('top speed', max(self.speed*3.6))

    def stututu_done(self):
        self.stututu = False

    def shift(self):
        """makes self.shift_call = True, this variable passes the shift message from the gui to the physics"""
        self.shift_call = True;

    # Function to find the index of the closest value in list1
    def find_closest_index(self,target):
        closest_index = None
        min_diff = float('inf')
        for i, value in enumerate(self.speed*3.6):
            diff = abs(value - target)
            if diff < min_diff:
                min_diff = diff
                closest_index = i
        return closest_index


    def show_time_to(self,input_speed):
        index = self.find_closest_index(input_speed)
        value = self.time[index]
        print(f'0 - {input_speed} kmh = {value}')

    def update_seconds(self, iter_index):
        self.current_seconds = self.time[iter_index]
        
    def downforce(self, speed):
        return self.car.df_coeff * speed**2
    
    def vertical_load(self, speed):
        result = self.car.weight + self.downforce(speed)
        return result
    
    """
    def plot(self):
        with PdfPages('all_plots.pdf') as pdf:
            # Speed plot
            plt.figure(figsize=(10, 8))
            plt.subplot(2, 2, 1)
            plt.plot(self.time, self.speed * 3.6)
            plt.xlabel('Time s')
            plt.ylabel('Speed km/h')
            plt.title('Speed')

            # N plot
            plt.subplot(2, 2, 2)
            plt.plot(self.time, self.cache['N'], label='tire forces')
            plt.title('Tire Forces (N)')

            # Forces plot
            plt.subplot(2, 2, 3)
            plt.plot(self.time, self.cache['tire_forces'])
            plt.xlabel('Time s')
            plt.ylabel('Force')
            plt.title('Tire Forces')

            # Gears plot
            plt.subplot(2, 2, 4)
            plt.plot(self.time, self.cache['gears'])
            plt.xlabel('Time s')
            plt.ylabel('Gear')
            plt.title('Gears')

            # Adjust layout and save
            plt.tight_layout()
            pdf.savefig()
            plt.close()
    """
    def weight_transfer(self, accel):
        """returns the percentage of car weight on driving wheels in [0,1]"""
        front_weight = 1 - self.car.rear_weight
        if self.car.drive == 1: #fwd
            A = 0; B = 1; C = -1
        elif self.car.drive == 0: # awd
            A = 1; B = 1; C = 0
        elif self.car.drive == -1: # rwd
            A = 1; B = 0; C = 1
        else:
            print("invalid drive type")

        formula = A * self.car.rear_weight + B * front_weight + C * (self.car.cm_height * self.accel / self.car.wheelbase)
        return formula
    
    def torque_at_wheel_axis(self,N, gear_index):
        engine_torque = self.car.torque(N)
        result =self.car.drive_efficiency * ( engine_torque * self.spool_loss) * self.car.gear[gear_index] * self.car.final_drive
        if result < 0:
            print("warning at Run.torque_at_wheel_axis: torque_at_wheel_axis not positive")
            print("input rpm = ", N)
            print("gear_index = ", gear_index)
            print("engine _ torque = ", engine_torque)
        return result
    
    def force_at_ground(self, N, gear_index) :
        '''force passed from the tyre to the ground'''
        if N >= self.car.redline: return 0
        random_factor = round(random.uniform(0.95, 1.0), 3) # random driver/road factor, wheelspin losses
        Fz = self.weight_transfer(self.accel) * self.car.weight * 9.81 #load_on_driving_tyres
        max_force = random_factor *  self.car.tyre_coeff * Fz **0.995
        torque_at_wheels = self.torque_at_wheel_axis(N, gear_index)
        result = min( torque_at_wheels/ self.car.wheel_radius, max_force)

        if torque_at_wheels/ self.car.wheel_radius > max_force:
            self.spinning = True
        else: self.spinning = False

        if result < 0:
            print("\nWarning at Run.force_at_ground: force_at_ground not positive")
            print("\t input rpm = ", N)
            print("\t gear_index = ", gear_index)
            print("\t torque_at_wheels = ", torque_at_wheels)
            #return 0
        return max(result, 1)

    def wheel_aero_drag(self,speed):
        return 2 * 0.000275 * speed**2 # approximately the aero drag of 2 16 inch tires
    
    def drag(self,speed): 
        return 0.5 * self.car.c_d * self.car.frontal * 1.2 * speed**2 + self.wheel_aero_drag(speed)
    
    def roll_resistance(self,speed):
        if speed > 0.1:
            return (0.02 + 1.111*1e-7*speed + .24 * 1e-7 * (speed/3.6)**2) * 9.81 * self.vertical_load(speed)
        else: return 0
    
    def f(self,t,speed,N): 
        '''du/dt = f, the derivative of speed in newton's equation. It is the sum of forces divided by mass'''
        Fg = self.force_at_ground(N, self.gear_index)
        Fdrag = self.drag(speed)
        Froll = self.roll_resistance(speed)
        result = (Fg - Fdrag - Froll)/self.car.weight
        if result > 0: return result
        else:
            print("Warning at Run.f: force not positive. Value = ", result)
            print("speed = ", speed)
            print("gear_index = ", self.gear_index)
            print("Fdrag = ", Fdrag)
            print("Froll = ", Froll)
            print("Fground = ", Fg)

            return 0.01
    
    def get_RPM(self, speed):
        """find engine speed from vehicle speed and gear index"""
        rpm = speed * 30 * self.car.gear[self.gear_index] * self.car.final_drive /(np.pi * self.car.wheel_radius)
        if rpm < self.car.idle_RPM or rpm > self.car.redline:
            print("Warning at Run.get_RPM: rpm not within range. Value = ", rpm)
            print("speed = ", speed)
        return min(rpm, self.car.redline)

    def get_max_speed_at_gear(self):
        return np.pi * self.car.wheel_radius * self.car.redline /(30 * self.car.final_drive * self.car.gear[self.gear_index])
    def simulate_step(self):  
      
        if self.iter_index == 0:
            self.launch_RPM = self.current_rpm
            if self.who == 1: self.launch_RPM = 4500

            # update cache
            """
            self.cache['N'][0] = self.current_rpm
            self.cache['tire_forces'][0]= self.force_at_ground(self.current_rpm, self.gear_index)
            self.cache['gears'][0] = 0
            """

        self.iter_index += 1
        i = self.iter_index
        self.update_seconds(i)

        # distance calculations
        self.current_distance += self.current_speed * (self.current_seconds - self.time[self.iter_index-1])
        if abs(self.current_distance - 400) < 1: print(f'0-400m in ', self.current_seconds)
        if abs(self.current_distance - 800) < 2: print(f'0-800m in ', self.current_seconds)
        
        if self.car.forced_induction in [1,2] and self.spool_loss < 1:
            self.spool_loss = min(1, self.spool_loss + self.car.spool_speed)

        
        if self.shifting:
            self.speed[i] = self.speed[i-1] - 0.05
            self.current_speed = self.speed[i]
            self.current_rpm -= 500 * self.car.flywheel_coefficient # rpm drop each step
            self.shift_iter_indexs_left -= 1
            ''' #
            file = open('log.txt', 'a')
            for spd in self.speed:
                file.write(f'{spd}  ')
            file.close()'''

            if self.shift_iter_indexs_left <= 0:
                self.shifting = False
                self.speed[i] += 0.3
                self.current_rpm = self.get_RPM(self.speed[i-1])
            
            # update cache
            """
            self.cache['N'][i]=(self.current_rpm)
            self.cache['tire_forces'][i] = 0
            self.cache['gears'][i] = self.gear_index
            """
            return

        # if not shifting :

        # runge kutta to calculate speed for next step of the simulation
        '''k1 = self.step * self.f(self.time[i-1], self.speed[i-1], self.current_rpm)
        k2 = self.step * self.f(self.time[i-1] + 0.5 * self.step, self.speed[i-1] + 0.5 * k1, self.current_rpm)
        k3 = self.step * self.f(self.time[i-1] + 0.5 * self.step, self.speed[i-1] + 0.5 * k2, self.current_rpm)
        k4 = self.step * self.f(self.time[i-1] + self.step, self.speed[i-1] + k3, self.current_rpm)
        R_K_solution = self.speed[i-1] + (1.0 / 6.0)*(k1 + 2 * k2 + 2 * k3 + k4)'''

        Euler_solution = self.speed[i-1] + self.step * self.f(self.time[i-1], self.speed[i-1], self.current_rpm)
        max_speed_at_current_gear = self.get_max_speed_at_gear()
        self.speed[i] = max(0.01, min(Euler_solution, max_speed_at_current_gear))
        self.current_speed = self.speed[i]

        # acceleration in G
        delta_u = self.speed[i] - self.speed[i-1]
        delta_t = self.step
        self.accel = delta_u / (delta_t * 9.81) # in G

        # update cache
        """
        self.cache['N'][i]=(self.current_rpm)
        self.cache['tire_forces'][i] = self.force_at_ground(self.current_rpm, self.gear_index)
        self.cache['gears'][i] = self.gear_index
        """

        '''#
        file = open('log.txt', 'a')
        for spd in self.speed:
            file.write(f'{spd}  ')
        file.close()'''

        # find the rpm for the next time step
        N_new = min(self.get_RPM(self.speed[i]) + self.clutch_extra_revs, self.car.redline) 
        self.clutch_extra_revs = max(0, self.clutch_extra_revs - 1000 / self.car.shift_delay_coefficient)

        if self.gear_index == 0:
            rng = random.randint(0,250)
            self.current_rpm = max(N_new, self.launch_RPM - rng) # in 1st gear, use launch rpm until wheel speed asks for more rpm
            #TODO: add a countdown to slowly transition to N_new
            #self.current_rpm = max(N_new, 5000 + (-1)**random.randint(0,1) * random.randint(50,150))
        else:
            self.current_rpm = N_new


        # if player pressed to shift           or  bot satisfies conditions
        if (self.who == 0 and self.shift_call) or (self.who == 1 and self.current_rpm >= self.car.redline - 50 - self.car.shift_earlier) :
            can_shift_gear = (self.gear_index < self.car.max_gear)
            too_early = (self.current_rpm < 3500)
            if (can_shift_gear) and (not too_early):
                self.shifting = True
                self.stututu = True
                self.shift_iter_indexs_left = self.car.shift_delay_coefficient+1
                self.gear_index+=1  # shift to next gear
                print('gear =',self.gear_index+1)

                # turbo spool losses and clutch rpm after shifting
                self.clutch_extra_revs = 60 * self.car.shift_delay_coefficient / ((self.gear_index+2) * self.car.flywheel_coefficient)
                if self.car.forced_induction == 1:
                    self.spool_loss = 0.2

            self.shift_call = False
        else: # make rpms jump off the redline
            if self.car.redline - self.current_rpm < 50:
                rng = random.randint(10,60)
                self.current_rpm -= rng

        return

# Assuming your CSV file is named 'cars.csv'
# Load the CSV into a DataFrame
df = pd.read_csv('cars.csv', skipinitialspace=True)

# car names
#car_name = "McLaren_Speedtail"
#car_name = "Nismo_400R"
car_name= "Citroen_Saxo_VTS_Custom"
#car_name = "2013_Peugeot_208_GTI"

print('initializing simulation...')
car = Car(car_name, df)
simulation = Run(car, who=0)
################################################################

app = Quart(__name__)

@app.route("/simulation/state", methods=['GET'])
def get_state():
    simulation.simulate_step()
    # Return the current state of the simulation
    return {
        "rpm":int(simulation.current_rpm),
        "speed":int(simulation.current_speed * 3.6),
        "time":int(simulation.current_seconds)
    }

@app.route("/simulation/shift", methods=['POST'])
async def shift():
    simulation.shift_call = True  # Call the shift method of your simulation class
    return jsonify({"status": "Shift successful"})

@app.route("/simulation/start", methods=['POST'])
async def start_simulation():
    simulation.simulate_step()  # Call the start method of your simulation class
    return jsonify({"status": "Simulation started"})


@app.route('/')
async def home():
    return await render_template('index.html')

if __name__ == '__main__':
    app.run(port=5005)