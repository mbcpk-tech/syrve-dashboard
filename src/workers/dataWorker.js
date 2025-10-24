self.onmessage = function (e) {
  let { rawData } = e.data;
  let result = {};

  rawData = cleanData(rawData);
  rawData = separateBranch(rawData);
  let salesResult = formatForSales(rawData)

  result = {
    rawData: rawData,
    ...salesResult
  }


  self.postMessage(result);
};

function cleanData(rawData) {
  let currentData = "";
  for (let i = 0; i < 5; i++) {
    rawData.forEach((ele, eidx) => {
      ele[i].length > 1 ? currentData = ele[i] : rawData[eidx][i] = currentData;
    })
  }
  rawData.forEach((ele, eidx) => {
    ele.forEach((val, idx) => {
      if (!isNaN(val) && val !== "") {
        ele[idx] = Number(val);
      }
    });
  })
  rawData = rawData.filter(row => {
    const saleValue = Number(row[8]) || 0;
    return saleValue > 0;
  });
  return rawData;
}; // cleanData


function separateBranch(rawData) {
  rawData.forEach((ele, eidx) => {
    if (ele[4].includes("FoodPanda")) {
      rawData[eidx][3] = "FoodPanda";
      if (ele[4].includes("Cash")) { rawData[eidx][4] = "CASH" }
      if (ele[4].includes("Online")) { rawData[eidx][4] = "ONLINE" }
    }
  })

  let groupedByBranch = rawData.reduce((acc, row) => {
    const branch = row[3];
    (acc[branch] ||= []).push(row);
    return acc;
  }, {});

  return groupedByBranch;
}; //separateBranch


function formatForSales(rawData) {
  const monthlyBranchTotals = {};
  const hourlyBranchTotals = {};
  const dailyBranchTotals = {};
  const payments = {};

  Object.keys(rawData).forEach(branch => {
    monthlyBranchTotals[branch] = {};
    hourlyBranchTotals[branch] = {};
    dailyBranchTotals[branch] = {};
    rawData[branch].forEach((saleItem) => {
      if (!saleItem || !saleItem[0]) return;
      const dateStr = saleItem[0].trim();
      const hourStr = saleItem[1];
      const saleValue = Number(saleItem[8]) || 0;
      const paymentName = saleItem[4];
      payments[paymentName] = (payments[paymentName] || 0) + saleValue;
      let dateObj;
      if (dateStr.includes('-')) {
        dateObj = new Date(dateStr);
      } else if (dateStr.includes('/')) {
        const [month, day, year] = dateStr.split('/');
        dateObj = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      } else {
        dateObj = new Date(dateStr);
      }
      if (isNaN(dateObj.getTime())) return;
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      monthlyBranchTotals[branch][monthKey] = (monthlyBranchTotals[branch][monthKey] || 0) + saleValue;
      const hourKey = `${String(hourStr).padStart(2, '0')}:00`;
      hourlyBranchTotals[branch][hourKey] = (hourlyBranchTotals[branch][hourKey] || 0) + saleValue;

      const dayName = dateObj.toLocaleString('en-US', { weekday: 'long' });
      dailyBranchTotals[branch][dayName] = (dailyBranchTotals[branch][dayName] || 0) + saleValue;
    });
  });

  // Fill 0 for non-existent hours
  Object.keys(hourlyBranchTotals).forEach(branch => {
    const fullHours = {};
    for (let h = 0; h < 24; h++) {
      const hourKey = `${String(h).padStart(2, '0')}:00`;
      fullHours[hourKey] = hourlyBranchTotals[branch][hourKey] || 0;
    }
    hourlyBranchTotals[branch] = fullHours;
  });

  return {
    hourlyBranchTotals,
    monthlyBranchTotals,
    dailyBranchTotals,
    payments
  }

}; //formatForSales