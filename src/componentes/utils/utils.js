
export const agregarCero = (digito) => {
    let str;
   if(typeof(digito) != "string"){
    digito = JSON.stringify(digito);
   }
    if(digito.length === 1){
        str = "0"+digito;
    }else{
        str = digito
    }
    return str;
}

export const pickTextColorBasedOnBgColorSimple = (bgColor, lightColor, darkColor) => {
    var color = (bgColor.charAt(0) === '#') ? bgColor.substring(1, 7) : bgColor;
    var r = parseInt(color.substring(0, 2), 16); // hexToR
    var g = parseInt(color.substring(2, 4), 16); // hexToG
    var b = parseInt(color.substring(4, 6), 16); // hexToB
    return (((r * 0.299) + (g * 0.587) + (b * 0.114)) > 186) ?
      darkColor : lightColor;
  }

  export const transpose = (a) => Object.keys(a[0]).map((c) => a.map((r) => r[c]))

  export const booleanToNumber = (value) => {
    return value ? 1 : 0;
  }

  export const numberToBoolean = (value) => {
    return value === 1;
  }