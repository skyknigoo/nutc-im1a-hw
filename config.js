// 1. Google Apps Script 部署後的 Web App URL (請換成你的)
const GAS_URL = "https://script.google.com/macros/s/AKfycbwHBR2yz-lZ3gy1ZegJ8N9KRaB2zTQoaJhBvlIafE0ciPOadOlDoOCpO3oyYbmChZBC/exec";

// 2. 雲端硬碟已建立的日期清單[cite: 3]
const COURSE_DATES = [
  "20260919",
  "20260926",
  "20261003",
  "20261017",
  "20261024",
  "20261031",
  "20261107",
  "20261114",
  "20261121",
  "20261128",
  "20261205",
  "20261212",
  "20261219",
  "20261226",
  "20270102",
  "20270109"
]; //[cite: 3]

// 3. 全班學生名冊 (學號 : { name: 姓名, className: 班級 })
const STUDENTS = {
  // 資管二A 選修同學
  "3311301031": { name: "蔡承益", className: "資管二A" },

  // 資管一A 同學
  "3311531001": { name: "黃淑娟", className: "資管一A" },
  "3311531002": { name: "黃瑜芳", className: "資管一A" },
  "3311531004": { name: "陳宗源", className: "資管一A" },
  "3311531005": "古楓崎",
  "3311531006": "袁雍華",
  "3311531007": "張靜宜",
  "3311531008": "余宜定",
  "3311531011": "鄭富隆",
  "3311531012": "林孟蓉",
  "3311531014": "陳季鋒",
  "3311531015": "林慧真",
  "3311531016": "盧姵其",
  "3311531017": "徐珈瑄",
  "3311531018": "游元霆",
  "3311531019": "周昱宇",
  "3311531020": "陳宥瑞",
  "3311531021": "謝揚勳",
  "3311531022": "陳琪筠",
  "3311531023": "蔡元祐",
  "3311531024": "林雅斌",
  "3311531026": "王柏凱",
  "3311531027": "廖家逸",
  "3311531028": "蕭祐珍",
  "3311531029": "蔡昆翰",
  "3311531030": "粘盈瑩",
  "3311531031": "鍾坊諭",
  "3311531032": "王威皓",
  "3311531034": "林芃",
  "3311531035": "孟家丞",
  "3311531036": "柯秀玲",
  "3311531037": "林菁絃",
  "3311531038": "周威廷",
  "3311531039": "林垂穎",
  "3311531041": "楊婷雅",
  "3311531042": "林昌宏",
  "3311531043": "黃俊翔",
  "3311531044": "謝奇峰",
  "3311531045": "黃倫偉",
  "3311431006": "呂珮甄",
  "3311431023": "徐羽喬",
  "3311331015": "楊孟欽"
};

// 統整資料格式（未特別標記班級者，預設為資管一A）
Object.keys(STUDENTS).forEach(id => {
  if (typeof STUDENTS[id] === "string") {
    STUDENTS[id] = { name: STUDENTS[id], className: "資管一A" };
  }
});

// 4. 動態填充下拉選單（過濾未來日期）
function initCourseDateSelect(selectElementId) {
  const select = document.getElementById(selectElementId);
  select.innerHTML = "";

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}${month}${day}`;

  const availableDates = COURSE_DATES.filter(d => d <= todayStr);

  if (availableDates.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.innerText = "尚未有可繳交之上課日期";
    select.appendChild(opt);
    return;
  }

  const sortedDates = [...availableDates].reverse();
  sortedDates.forEach((dateStr, idx) => {
    const opt = document.createElement("option");
    opt.value = dateStr;
    const formatted = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    opt.innerText = `${formatted} (週六)`;
    if (idx === 0) opt.selected = true;
    select.appendChild(opt);
  });
}