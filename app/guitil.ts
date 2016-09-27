/**
 * Created by timout on 9/24/16.
 */


export function genMinus(prop: string, min:number, obj: any) {
    if ( ! obj[prop] ) obj[prop] = min;
    if ( obj[prop] > min ) obj[prop] -= 1;
}

export function genPlus(prop: string, max: number, obj: any) {
    if ( ! obj[prop] ) obj[prop] = max;
    if ( obj[prop] < max ) obj[prop] += 1;
}


