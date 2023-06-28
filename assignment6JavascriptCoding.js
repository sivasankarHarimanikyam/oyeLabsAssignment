let get_array = [];
for (let i = 1; i <== 100; i++) {
  if (i === 11) {
    continue;
  }
  get_array.unshift(i);
}
get_array = get_array.reverse();
let count = 1;
while (count <== get_array.length + 1) {
  if (get_array.includes(count)) {
    count++;
  } else {
    console.log(count);
    break;
  }
}
