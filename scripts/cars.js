// tyre coeff: not friction coefficient
// normal road tires: 1.1
// high performance sports tires : 1.4
// drag slicks : 1.7
// lsd adds 0.1

const cars = [
    {
        name: "McLaren_Speedtail",
        make: "McLaren",
        model: "Speedtail",
        weight: 1597,
        rear_weight: 0.58,
        c_d: 0.35,
        frontal: 1.98,
        df_coeff: 0.028,
        wheel_radius: 0.36,
        tyre_coeff: 1.5,
        cm_height: 0.35,
        wheelbase: 2.73,
        drive: -1,
        final_drive: 3.31,
        gear_1: 3.98,
        gear_2: 2.61,
        gear_3: 1.9,
        gear_4: 1.48,
        gear_5: 1.16,
        gear_6: 0.91,
        gear_7: 0.69,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 2,
        flywheel_coefficient: 0.8,
        drive_efficiency: 0.85,
        redline: 8000,
        forced_induction: 2,
        electric: 0,
        coefficient_0: -2.2588688270E+03,
        coefficient_1: 5.3351782800E+00,
        coefficient_2: -3.3069423500E-03,
        coefficient_3: 1.0432089900E-06,
        coefficient_4: -1.7753030000E-10,
        coefficient_5: 1.5498131500E-14,
        coefficient_6: -5.4447140200E-19,
        coefficient_7: 0.0000000000E+00,
        max_gear: 6,
        flat_turbo: 0,
        max_torque: 1150,
        shift_earlier: 100,
        spool_speed: 0.2,
        blow_off: 1,
        lsd: 1
    },
    {
        name: "2013_Peugeot_208_GTI",
        make: "Peugeot",
        model: "208 GTI",
        weight: 1160,
        rear_weight: 0.38,
        c_d: 0.345,
        frontal: 2.1,
        df_coeff: -0.08,
        wheel_radius: 0.3085,
        tyre_coeff: 1.1,
        cm_height: 0.58,
        wheelbase: 2.537,
        drive: 1,
        final_drive: 3.562,
        gear_1: 3.538,
        gear_2: 1.92,
        gear_3: 1.322,
        gear_4: 1.025,
        gear_5: 0.822,
        gear_6: 0.68,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 7,
        flywheel_coefficient: 0.25,
        drive_efficiency: 0.88,
        redline: 6500,
        forced_induction: 1,
        electric: 0,
        coefficient_0: -2.50403182e+02,
        coefficient_1: 6.27321108e-01,
        coefficient_2: -2.51880483e-04,
        coefficient_3: 4.25299675e-08,
        coefficient_4: -2.62612991e-12,
        coefficient_5: 0.0000000000E+00,
        coefficient_6: 0.0000000000E+00,
        coefficient_7: 0.0000000000E+00,
        max_gear: 5,
        flat_turbo: 1,
        max_torque: 275,
        shift_earlier: 100,
        spool_speed: 0.09,
        blow_off: 3,
        lsd: 0
    },
    {
        name: "Nismo_400R",
        make: "Nismo",
        model: "400R",
        weight: 1550,
        rear_weight: 0.42,
        c_d: 0.4,
        frontal: 2.2,
        df_coeff: -0.04,
        wheel_radius: 0.325,
        tyre_coeff: 1.5,
        cm_height: 0.48,
        wheelbase: 2.72,
        drive: 0,
        final_drive: 4.111,
        gear_1: 3.214,
        gear_2: 1.925,
        gear_3: 1.302,
        gear_4: 1,
        gear_5: 0.752,
        gear_6: 0,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 8,
        flywheel_coefficient: 0.3,
        drive_efficiency: 0.83,
        redline: 8000,
        forced_induction: 1,
        electric: 0,
        coefficient_0: 1.8029000000E+01,
        coefficient_1: 2.5567000000E-01,
        coefficient_2: -5.4200000000E-05,
        coefficient_3: 5.8112000000E-09,
        coefficient_4: -3.2140000000E-13,
        coefficient_5: 0.0000000000E+00,
        coefficient_6: 0.0000000000E+00,
        coefficient_7: 0.0000000000E+00,
        max_gear: 4,
        flat_turbo: 0,
        max_torque: 469,
        shift_earlier: 500,
        spool_speed: 0.065,
        blow_off: 2,
        lsd: 1
    },
    {
        name: "Opel_Corsa_C_1.4",
        make: "Opel",
        model: "Corsa C 1.4",
        weight: 960,
        rear_weight: 0.42,
        c_d: 0.32,
        frontal: 1.97,
        df_coeff: -0.12,
        wheel_radius: 0.291,
        tyre_coeff: 1.1,
        cm_height: 0.58,
        wheelbase: 2.491,
        drive: 1,
        final_drive: 3.938,
        gear_1: 3.727,
        gear_2: 2.136,
        gear_3: 1.414,
        gear_4: 1.121,
        gear_5: 0.892,
        gear_6: 0,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 9,
        flywheel_coefficient: 0.3,
        drive_efficiency: 0.87,
        redline: 6200,
        forced_induction: 0,
        electric: 0,
        coefficient_0: -1.66156338e+02,
        coefficient_1: 4.62088044e-01,
        coefficient_2: -3.53521027e-04,
        coefficient_3: 1.47346084e-07,
        coefficient_4: -3.34547465e-11,
        coefficient_5: 3.87810358e-15,
        coefficient_6: -1.80120051e-19,
        coefficient_7: 0.0000000000E+00,
        max_gear: 4,
        flat_turbo: 0,
        max_torque: 125,
        shift_earlier: 500,
        spool_speed: 0,
        blow_off: 0,
        lsd: 0
    },
    {
        name: "BMW_M3_E92_manual",
        make: "BMW",
        model: "M3 E92",
        weight: 1655,
        rear_weight: 0.478,
        c_d: 0.31,
        frontal: 2.17,
        df_coeff: -0.06,
        wheel_radius: 0.3345,
        tyre_coeff: 1.5,
        cm_height: 0.432,
        wheelbase: 2.761,
        drive: -1,
        final_drive: 3.846,
        gear_1: 4.055,
        gear_2: 2.368,
        gear_3: 1.582,
        gear_4: 1.192,
        gear_5: 1,
        gear_6: 0.872,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 7,
        flywheel_coefficient: 0.3,
        drive_efficiency: 0.88,
        redline: 8400,
        forced_induction: 0,
        electric: 0,
        coefficient_0: 2.16693393e+02,
        coefficient_1: 1.64150666e-03,
        coefficient_2: 6.10191466e-05,
        coefficient_3: -2.22780739e-08,
        coefficient_4: 3.09136264e-12,
        coefficient_5: -1.69350762e-16,
        coefficient_6: 2.01594374e-21,
        coefficient_7: 0.0000000000E+00,
        max_gear: 5,
        flat_turbo: 0,
        max_torque: 400,
        shift_earlier: 300,
        spool_speed: 0,
        blow_off: 0,
        lsd: 1
    },
    {
        name: "Toyota_Supra_FF",
        make: "Toyota",
        model: "Brian's Supra",
        weight: 1632,
        rear_weight: 0.47,
        c_d: 0.35,
        frontal: 2.05,
        df_coeff: 0.01,
        wheel_radius: 0.3305, //255/30/19
        tyre_coeff: 1.5,
        cm_height: 0.47,
        wheelbase: 2.55,
        drive: -1,
        final_drive: 3.27,
        gear_1: 3.827,
        gear_2: 2.360,
        gear_3: 1.685,
        gear_4: 1.312,
        gear_5: 1,
        gear_6: 0.793,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 7,
        flywheel_coefficient: 0.3,
        drive_efficiency: 0.86,
        redline: 7500,
        forced_induction: 1,
        electric: 0,
        coefficient_0: -392.6531383229182,
        coefficient_1: 1.152444724580228,
        coefficient_2: -0.0006901087674985994,
        coefficient_3: 2.2749631938259799e-07,
        coefficient_4: -4.0771286040973834e-11,
        coefficient_5: 3.7290214007483495e-15,
        coefficient_6: -1.3687350112962504e-19,
        coefficient_7: 0.0000000000E+00,
        max_gear: 5,
        flat_turbo: 0,
        max_torque: 590,
        shift_earlier: 300,
        spool_speed: 0.03,
        blow_off: 1,
        lsd: 1
    },
    {
        name: "Citroen_Saxo_VTS",
        make: "Citroen",
        model: "Saxo VTS",
        weight: 935,
        rear_weight: 0.37,
        c_d: 0.33,
        frontal: 1.82,
        df_coeff: -0.13,
        wheel_radius: 0.2795,
        tyre_coeff: 1.1,
        cm_height: 0.58,
        wheelbase: 2.385,
        drive: 1,
        final_drive: 3.936,
        gear_1: 3.416,
        gear_2: 1.95,
        gear_3: 1.366,
        gear_4: 1.054,
        gear_5: 0.853,
        gear_6: 0,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 9,
        flywheel_coefficient: 0.23,
        drive_efficiency: 0.87,
        redline: 7250,
        forced_induction: 0,
        electric: 0,
        coefficient_0: -54.66400336834832,
        coefficient_1: 0.1878006900789541,
        coefficient_2: -8.192142589068137e-05,
        coefficient_3: 1.8706379739226737e-08,
        coefficient_4: -2.0781926751050148e-12,
        coefficient_5: 8.597291833119668e-17,
        coefficient_6: 0.0000000000E+00,
        coefficient_7: 0.0000000000E+00,
        max_gear: 4,
        flat_turbo: 0,
        max_torque: 145,
        shift_earlier: 100,
        spool_speed: 0,
        blow_off: 0,
        lsd: 0
    },
    {
        name: "Peugeot_106_GTI",
        make: "Peugeot",
        model: "106 GTI",
        weight: 925,
        rear_weight: 0.37,
        c_d: 0.33,
        frontal: 1.82,
        df_coeff: -0.13,
        wheel_radius: 0.2795,
        tyre_coeff: 1.1,
        cm_height: 0.58,
        wheelbase: 2.385,
        drive: 1,
        final_drive: 3.936,
        gear_1: 3.416,
        gear_2: 1.95,
        gear_3: 1.366,
        gear_4: 1.054,
        gear_5: 0.853,
        gear_6: 0,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 9,
        flywheel_coefficient: 0.23,
        drive_efficiency: 0.87,
        redline: 7250,
        forced_induction: 0,
        electric: 0,
        coefficient_0: -54.66400336834832,
        coefficient_1: 0.1878006900789541,
        coefficient_2: -8.192142589068137e-05,
        coefficient_3: 1.8706379739226737e-08,
        coefficient_4: -2.0781926751050148e-12,
        coefficient_5: 8.597291833119668e-17,
        coefficient_6: 0.0000000000E+00,
        coefficient_7: 0.0000000000E+00,
        max_gear: 4,
        flat_turbo: 0,
        max_torque: 145,
        shift_earlier: 100,
        spool_speed: 0,
        blow_off: 0,
        lsd: 0
    },
    {
        name: "Saxo_VTS_Custom",
        make: "Citroen",
        model: "Dev's Saxo VTS",
        weight: 975,
        rear_weight: 0.368,
        c_d: 0.346,
        frontal: 1.84,
        df_coeff: -0.08,
        wheel_radius: 0.2985,
        tyre_coeff: 1.1,
        cm_height: 0.55,
        wheelbase: 2.38,
        drive: 1,
        final_drive: 4.538,
        gear_1: 3.416,
        gear_2: 1.95,
        gear_3: 1.357,
        gear_4: 1.054,
        gear_5: 0.854,
        gear_6: 0,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 12,
        flywheel_coefficient: 0.23,//0.,
        drive_efficiency: 0.86,
        redline: 8250,
        forced_induction: 0,
        electric: 0,
        coefficient_0: -2.37696560e+01,
        coefficient_1: 1.30960947e-01,
        coefficient_2: -6.06218298e-05,
        coefficient_3: 1.59605879e-08,
        coefficient_4: -1.91153894e-12,
        coefficient_5: 8.12804215e-17,
        coefficient_6: 0.0000000000E+00,
        coefficient_7: 0.0000000000E+00,
        max_gear: 4,
        flat_turbo: 0,
        max_torque: 182,
        shift_earlier: 100,
        spool_speed: 0,
        blow_off: 0,
        lsd: 0,
        sound_pitch_0: 0.18,
        sound_pitch_1: 1.03
    },
    {
        name: "Peugeot_308_GTI",
        make: "Peugeot",
        model: "2018 308 GTI 270",
        weight: 1205,
        rear_weight: 0.37,
        c_d: 0.29,
        frontal: 2.28,
        df_coeff: -0.07,
        wheel_radius: 0.3235,
        tyre_coeff: 1.2,
        cm_height: 0.58,
        wheelbase: 2.620,
        drive: 1,
        final_drive: 4.176,
        gear_1: 3.538,
        gear_2: 1.92,
        gear_3: 1.433,
        gear_4: 1.102,
        gear_5: 0.88,
        gear_6: 0.744,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 7,
        flywheel_coefficient: 0.22,
        drive_efficiency: 0.87,
        redline: 6500,
        forced_induction: 1,
        electric: 0,
        coefficient_0: 863.7142857169003,
        coefficient_1: -2.380245021651249,
        coefficient_2: 0.0029531025252579435,
        coefficient_3: -1.7042150673424146e-06,
        coefficient_4: 5.325126262632084e-10,
        coefficient_5: -9.313779461288092e-14,
        coefficient_6: 8.594805194812508e-18,
        coefficient_7: -3.263588263591031e-22,
        max_gear: 5,
        flat_turbo: 1,
        max_torque: 330,
        shift_earlier: 100,
        spool_speed: 0.09,
        blow_off: 3,
        lsd: 1
    },
];

/*
    {
        name: "Citroen_Saxo_VTS_Custom",
        weight: 1000,
        rear_weight: 0.37,
        c_d: 0.345,
        frontal: 1.84,
        df_coeff: 0.015,
        wheel_radius: 0.2985,
        tyre_coeff: 1,
        cm_height: 0.64,
        wheelbase: 2.38,
        drive: 1,
        final_drive: 4.538,
        gear_1: 3.416,
        gear_2: 1.95,
        gear_3: 1.357,
        gear_4: 1.054,
        gear_5: 0.854,
        gear_6: 0,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1100,
        shift_delay_coefficient: 9,
        flywheel_coefficient: 0.23,
        drive_efficiency: 0.85,
        redline: 8200,
        forced_induction: 0,
        electric: 0,
        coefficient_0: -2.37696560e+01,
        coefficient_1: 1.30960947e-01,
        coefficient_2: -6.06218298e-05,
        coefficient_3: 1.59605879e-08,
        coefficient_4: -1.91153894e-12,
        coefficient_5: 8.12804215e-17,
        coefficient_6: 0.0000000000E+00,
        coefficient_7: 0.0000000000E+00,
        max_gear: 4,
        flat_turbo: 0,
        max_torque: 182,
        shift_earlier: 100,
        spool_speed: 0,
        blow_off: 0
    },
*/

/*
{
        name: "Opel_Corsa_C_1.4",
        make: "Opel",
        model: "Corsa C 1.4 16V",
        weight: 960,
        rear_weight: 0.42,
        c_d: 0.32,
        frontal: 2.2,
        df_coeff: 0.02,
        wheel_radius: 0.325,
        tyre_coeff: 1,
        cm_height: 0.65,
        wheelbase: 2.72,
        drive: 0,
        final_drive: 4.111,
        gear_1: 3.214,
        gear_2: 1.925,
        gear_3: 1.302,
        gear_4: 1,
        gear_5: 0.752,
        gear_6: 0,
        gear_7: 0,
        gear_8: 0,
        gear_9: 0,
        idle_RPM: 1000,
        shift_delay_coefficient: 8,
        flywheel_coefficient: 0.3,
        drive_efficiency: 0.8,
        redline: 8000,
        forced_induction: 1,
        electric: 0,
        coefficient_0: 1.8029000000E+01,
        coefficient_1: 2.5567000000E-01,
        coefficient_2: -5.4200000000E-05,
        coefficient_3: 5.8112000000E-09,
        coefficient_4: -3.2140000000E-13,
        coefficient_5: 0.0000000000E+00,
        coefficient_6: 0.0000000000E+00,
        coefficient_7: 0.0000000000E+00,
        max_gear: 4,
        flat_turbo: 0,
        max_torque: 469,
        shift_earlier: 500,
        spool_speed: 0,
        blow_off: 0
    }
*/