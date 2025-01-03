const cars = [
    {
        name: "McLaren_Speedtail",
        make: "McLaren",
        model: "Speedtail",
        weight: 1597,
        rear_weight: 0.58,
        c_d: 0.35,
        frontal: 1.98,
        df_coeff: 0.03,
        wheel_radius: 0.36,
        tyre_coeff: 1.3,
        cm_height: 0.6,
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
        drive_efficiency: 0.86,
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
        blow_off: 1
    },
    {
        name: "2013_Peugeot_208_GTI",
        make: "Peugeot",
        model: "208 GTI",
        weight: 1160,
        rear_weight: 0.38,
        c_d: 0.345,
        frontal: 2.1,
        df_coeff: 0.015,
        wheel_radius: 0.3085,
        tyre_coeff: 1,
        cm_height: 0.66,
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
        drive_efficiency: 0.86,
        redline: 6250,
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
        blow_off: 3
    },
    {
        name: "Nismo_400R",
        make: "Nismo",
        model: "400R",
        weight: 1550,
        rear_weight: 0.42,
        c_d: 0.4,
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
        spool_speed: 0.065,
        blow_off: 2
    },
    {
        name: "Opel_Corsa_C_1.4",
        make: "Opel",
        model: "Corsa C 1.4",
        weight: 960,
        rear_weight: 0.42,
        c_d: 0.32,
        frontal: 1.97,
        df_coeff: 0,
        wheel_radius: 0.291,
        tyre_coeff: 1,
        cm_height: 0.64,
        wheelbase: 2.491,
        drive: 1,
        final_drive: 3.740,
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
        drive_efficiency: 0.84,
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
        blow_off: 0
    }
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