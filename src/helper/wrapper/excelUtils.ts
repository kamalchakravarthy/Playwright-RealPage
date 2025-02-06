
import { Workbook } from 'exceljs';

export default class DateUtil {
  constructor() { }
async  updateExcel(path:string) {
  // Open Excel file
  const workbook = new Workbook();
  await workbook.xlsx.readFile(`${path}`);
  const worksheet = workbook.getWorksheet('Sheet1');

  // Read and update cell
  const cell = worksheet.getCell('A1');
  console.log(`Old Value: ${cell.value}`);
  cell.value = 'New Value';
  console.log(`New Value: ${cell.value}`);

  // Save the updated Excel file
  await workbook.xlsx.writeFile('path/to/your/excel/file.xlsx');
}
}

