// 1. Google Apps Script 部署後的 Web App URL (請再次確認是否為目前最新部署的網址)
const GAS_URL = "https://script.google.com/macros/s/AKfycbwHBR2yz-lZ3gy1ZegJ8N9KRaB2zTQoaJhBvlIafE0ciPOadOlDoOCpO3oyYbmChZBC/exec";

// 2. 學校個人網頁空間基礎網址規則
const NUTC_BASE_URL = "http://web3.nutc.edu.tw/~s";

// 3. 上課日期清單
const COURSE_DATES = [
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
];

// 4. 全班與補修學生名冊（由 GAS 從 Google 試算表「同學資料表」動態載入）
let STUDENTS = {};

async function loadStudentsFromSheet() {
  const targetApiUrl = `${GAS_URL}?action=getStudents`;
  console.log("【Debug】準備向 GAS 發送請求：", targetApiUrl);

  try {
    const res = await fetch(targetApiUrl);
    const data = await res.json();
    console.log("【Debug】成功收到 GAS 回傳的資料：", data);

    // 相容處理：若 data 本身就是學生物件對應表，或包在 data.students 裡
    if (data.status === "success" && data.students) {
      STUDENTS = data.students;
    } else if (data && typeof data === "object" && !Array.isArray(data)) {
      STUDENTS = data.students || data;
    }

    console.log("【Debug】成功載入學生名冊，總人數：", Object.keys(STUDENTS).length);
  } catch (err) {
    console.error("【Debug】❌ 無法從試算表載入學生名單，發生錯誤：", err);
  }
  return STUDENTS;
}

// 5. 動態填充下拉選單（過濾未來時間，只顯示今天與過去的日期）
function initCourseDateSelect(selectElementId) {
  const select = document.getElementById(selectElementId);
  if (!select) return;
  select.innerHTML = "";

  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const todayStr = `${y}${m}${d}`;

  const pastOrTodayDates = COURSE_DATES.filter(dateStr => dateStr <= todayStr);

  if (pastOrTodayDates.length === 0) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.innerText = "尚無已開放的上課日期";
    select.appendChild(opt);
    return;
  }

  pastOrTodayDates.sort().reverse();

  pastOrTodayDates.forEach((dateStr, idx) => {
    const opt = document.createElement("option");
    opt.value = dateStr;
    const formatted = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    opt.innerText = `${formatted} (週六)`;

    if (idx === 0) opt.selected = true;
    select.appendChild(opt);
  });
}