const m = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябырь",
  "Декабырь",
];

export function formatData(salaryList) {
  const month = {};
  const arr = [];
  if (salaryList.length) {
    for (let j = 0; j < m.length; j++) {
      month[m[j]] = [];
      for (let i = 0; i < salaryList.length; i++) {
        if (m[j] === salaryList[i].month) {
          month[m[j]].push(salaryList[i]);
        }
      }
    }
  }
  for (let obj in month) {
    arr.push({ month: obj, records: month[obj] });
  }

  let res = arr.filter((item) => item.records.length && item);
  return res;
}
