const displayHeader = title => {
  let size = 40;
  let left = Math.round((size - title.length) / 2) - 1;

  console.log('');
  console.log(Array(size).fill('-').join(''));
  console.log(Array(left).fill(' ').join('') + title.brightWhite);
  console.log(Array(size).fill('-').join(''));
  console.log('');
};
module.exports = displayHeader;
