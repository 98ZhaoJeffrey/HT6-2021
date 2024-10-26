import { Unit } from "../ts/types";

// i have no idea if this actually works, lets hope these conversions are correct lol
const conversions: Record<Unit, Partial<Record<Unit, number>>> = {
    "ea": {
        "ea": 1
    },
    "ml": {
        // convert to L, oz, pt, qt, gals, tsp, tbsp, c
        "L": 0.001,
        "oz": 0.033814,
        "pt": 0.00211338,
        "qt": 0.00105669,
        "gals": 0.000264172,
        "tsp": 0.202884,
        "tbsp": 0.067628,
        "c": 0.00422675
    },
    "L": {
        // convert to ml, oz, pt, qt, gals, tsp, tbsp, c
        "ml": 1000,
        "oz": 33.814,
        "pt": 2.11338,
        "qt": 1.05669,
        "gals": 0.264172,
        "tsp": 202.884,
        "tbsp": 67.628,
        "c": 4.22675
    }, 
    "oz": {
        // convert to L, ml, pt, qt, gals, tsp, tbsp, c
        "L": 0.0295735,
        "ml": 29.5735,
        "pt": 0.0625,
        "qt": 0.03125,
        "gals": 0.0078125,
        "tsp": 6,
        "tbsp": 2,
        "c": 0.166667
    },
    "pt": {
        "L": 0.473176,
        "ml": 0.00473176,
        "oz": 16,
        "qt": 0.5,
        "gals": 0.125,
        "tsp": 96,
        "tbsp": 32,
        "c": 2
    },
    "qt": {
        "L": 0.946353,
        "ml": 0.00946353,
        "oz": 32,
        "pt": 2,
        "gals": 0.25,
        "tsp": 192,
        "tbsp": 64,
        "c": 4
    }, 
    "gals": {
        "L": 3.78541,
        "ml": 0.00378541,
        "oz": 128,
        "pt": 8,
        "qt": 4,
        "tsp": 768,
        "tbsp": 256,
        "c": 16
    },
    "c": {
        "L": 0.24,
        "oz": 8.11537,
        "pt": 0.5,
        "qt": 0.25,
        "gals": 0.0625,
        "tsp": 48,
        "tbsp": 16,
        "ml": 240
    },
    "lbs": {
        "c": 2.40187,
        "gram": 453.592,
        "mg": 453592,
        "kg": 0.453592
    },
    "mg": {
        "gram": 0.0001,
        "lbs": 0.00000220462,
        "kg": 1/1000000,
        "oz": 0.00003527
    }, 
    "gram": {
        "lbs": 0.00220462,
        "mg": 1000,
        "kg": 0.001,
        "oz": 0.035274
    }, 
    "kg": {
        "gram": 1000,
        "mg": 1000,
        "lbs": 2.20462,
        "oz": 35.2739619
    }, 
    "tsp": {
        "tbsp": 1/3,
        "c": 0.0208333,
        "ml": 4.92892,
        "L": 0.00492892
    }, 
    "tbsp":{
        "tbsp": 3,
        "c": 1/16,
        "ml": 14.7868,
        "L": 0.0147868
    } 
}

function conversion(amount: number, from: Unit, to: Unit): number {
    const convert = conversions[from];
    if (convert[to] !== undefined) {
        return amount * convert[to]!;
    } else {
        throw new Error(`Invalid conversion from ${from} to ${to}`);
    }
}
// convert to metric / imperial 
function commonConversion(amount: number, from: Unit) {
    let to: Unit;
    switch(from){
        case "ea":
            to = "ea";
            break;
        case "ml":
            to = "tsp";
            break;
        case "L":
            to = "pt";
            break;
        case "oz":
            to = "ml";
            break;
        case "pt":
            to = "L";
            break;
        case "qt":
            to = "L";
            break;
        case "gals":
            to = "L";
            break;
        case "lbs":
            to = "kg";
            break;
        case "mg":
            to = "lbs";
            break;
        case "gram":
            to = "oz";
            break;
        case "kg":
            to = "lbs";
            break;
        case "tsp":
            to = "ml";
            break;
        case "tbsp":
            to = "ml";
            break;
        case "c":
            to = "ml";
            break
        default:
            to = from;
            break;
    }
    return {"unit": to, "amount": conversion(amount, from, to)};
}

function conversionsTo (unit: Unit) {
    return Object.keys(conversions[unit])
}

  
export { conversion, commonConversion, conversionsTo };