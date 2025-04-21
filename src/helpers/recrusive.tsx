import _ from "lodash";

export const nestingMap = (data: any[], dataClone: any, flaging: any, childName: any) => {
  for (var i = 0; i < data.length; i++) {
    /* do something useful */
    _.map(dataClone, (idx, key) => {
      if (idx[flaging[0]] === data[i][flaging[1]]) {
        dataClone[key][childName] = dataClone[key][childName]?.length
          ? [...dataClone[key][childName], data[i]]
          : [data[i]];
      }
    });
  }
};