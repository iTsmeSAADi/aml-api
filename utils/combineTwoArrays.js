// Function to combine the arrays based on the condition
export const combineArrays = (arr1, arr2) => {
  const combinedArray = [];

  for (const item1 of arr1) {
    //.find() to find the first success
    const matchedItem = arr2.find(
      (item2) => item2.docupass_customid === item1._id.toString()
    );

    //push adds to the end of array
    if (matchedItem) {
      combinedArray.push({
        ...item1,
        ...matchedItem,
      });
    }
  }

  return combinedArray;
};
