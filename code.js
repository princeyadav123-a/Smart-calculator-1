// --- ग्लोबल वैरिएबल्स ---
let calculationHistory = [];

// --- टैब मैनेजमेंट का लॉजिक ---
function openTab(event, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
}

// --- More Menu और Modal का लॉजिक ---
const moreMenuBtn = document.getElementById('more-menu-btn');
const moreMenu = document.getElementById('more-menu');

moreMenuBtn.addEventListener('click', (event) => {
    event.stopPropagation(); // Click को फैलने से रोकें
    moreMenu.classList.toggle('hidden');
});

// कहीं और क्लिक करने पर मेनू बंद करें
window.addEventListener('click', () => {
    if (!moreMenu.classList.contains('hidden')) {
        moreMenu.classList.add('hidden');
    }
});

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
    moreMenu.classList.add('hidden'); // मेनू को बंद करें
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// --- सामान्य कैलकुलेटर का लॉजिक (पहले जैसा) ---
const calcDisplay=document.getElementById("calcDisplay");let currentInput="0";function appendInput(t){("0"===currentInput||"Error"===currentInput)&&(currentInput=""),currentInput+=t,updateDisplay()}function clearDisplay(){currentInput="0",updateDisplay()}function deleteLast(){""===(currentInput=currentInput.slice(0,-1))&&(currentInput="0"),updateDisplay()}function calculateResult(){try{let t=currentInput.replace(/%/g,"/100").replace(/×/g,"*").replace(/÷/g,"/"),e=eval(t);addToHistory(currentInput,e),(currentInput=e.toString()).length>10&&(currentInput=e.toExponential(5))}catch(t){currentInput="Error"}updateDisplay()}function updateDisplay(){let t=currentInput.replace(/\*/g,"×").replace(/\//g,"÷");calcDisplay.textContent=t}

// --- हिस्ट्री का लॉजिक (अपडेटेड) ---
function addToHistory(expression, result) { /* ... (Same as before) ... */ calculationHistory.unshift({expression,result}),calculationHistory.length>20&&calculationHistory.pop(),updateHistoryDisplay() }
function updateHistoryDisplay() { /* ... (Same as before) ... */ const t=document.getElementById("history-list");if(t.innerHTML="",""===calculationHistory.length)return void(t.innerHTML="<li>No history yet.</li>");calculationHistory.forEach(e=>{const n=document.createElement("li");n.innerHTML=`<span class="history-expression">${e.expression}</span><span class="history-result">${e.result}</span>`,n.onclick=()=>useHistoryResult(e.result),t.appendChild(n)})}
function clearHistory() { /* ... (Same as before) ... */ calculationHistory=[],updateHistoryDisplay() }

function useHistoryResult(result) {
    currentInput = result.toString();
    updateDisplay();
    hideModal('history-modal'); // हिस्ट्री मोडल बंद करें
    // एक्टिव टैब को कैलकुलेटर पर सेट करें
    openTab({ currentTarget: document.querySelector('.tab-button[onclick*="calculator"]') }, 'calculator');
}

// --- GST, Discount, BMI, Unit Converter का लॉजिक (पहले जैसा) ---
// Note: No changes needed for these calculation functions.
function calculateGST(){const t=parseFloat(document.getElementById("baseAmount").value)||0,e=parseFloat(document.getElementById("gstRate").value)||0,n=t*e/100,o=t+n;document.getElementById("gstAmount").textContent=`₹${n.toFixed(2)}`,document.getElementById("totalAmount").textContent=`₹${o.toFixed(2)}`}
function calculateDiscount(){const t=parseFloat(document.getElementById("originalPrice").value)||0,e=parseFloat(document.getElementById("discountPercent").value)||0,n=t*e/100,o=t-n;document.getElementById("savedAmount").textContent=`₹${n.toFixed(2)}`,document.getElementById("finalPrice").textContent=`₹${o.toFixed(2)}`}
function switchBmiUnits(){"metric"===document.querySelector('input[name="bmiUnit"]:checked').value?(document.getElementById("metric-inputs").classList.remove("hidden"),document.getElementById("imperial-inputs").classList.add("hidden")):(document.getElementById("metric-inputs").classList.add("hidden"),document.getElementById("imperial-inputs").classList.remove("hidden")),document.getElementById("heightCm").value="",document.getElementById("weightKg").value="",document.getElementById("heightFt").value="",document.getElementById("heightIn").value="",document.getElementById("weightLbs").value="",calculateBMI()}
function calculateBMI(){let t,e,n,o,l,a,s,c=document.querySelector('input[name="bmiUnit"]:checked').value;e="metric"===c?(t=parseFloat(document.getElementById("heightCm").value)/100||0,parseFloat(document.getElementById("weightKg").value)||0):(n=parseFloat(document.getElementById("heightFt").value)||0,o=parseFloat(document.getElementById("heightIn").value)||0,l=(12*n+o)*.0254,(parseFloat(document.getElementById("weightLbs").value)||0)*.453592);let d=0;t>0&&e>0?d=e/(t*t):l>0&&e>0&&(d=e/(l*l));const i=document.getElementById("bmiValue"),u=document.getElementById("bmiCategory");i.textContent=d.toFixed(1);const {category:m,className:r}=getBmiCategory(d);u.textContent=m,u.classList.remove("bmi-underweight","bmi-normal","bmi-overweight","bmi-obese"),r&&u.classList.add(r)}
function getBmiCategory(t){return t<=0?{category:"Enter your details",className:""}:t<18.5?{category:"Underweight",className:"bmi-underweight"}:t<25?{category:"Normal weight",className:"bmi-normal"}:t<30?{category:"Overweight",className:"bmi-overweight"}:{category:"Obese",className:"bmi-obese"}}
const conversionFactors={length:{meter:1,kilometer:1e3,centimeter:.01,millimeter:.001,mile:1609.34,yard:.9144,foot:.3048,inch:.0254},weight:{gram:1,kilogram:1e3,milligram:.001,pound:453.592,ounce:28.3495}},fromUnitSelect=document.getElementById("fromUnit"),toUnitSelect=document.getElementById("toUnit"),conversionTypeSelect=document.getElementById("conversionType");function updateUnits(){const e=conversionTypeSelect.value;fromUnitSelect.innerHTML="",toUnitSelect.innerHTML="";let t="temperature"===e?["Celsius","Fahrenheit","Kelvin"]:Object.keys(conversionFactors[e]);t.forEach(e=>{fromUnitSelect.innerHTML+=`<option value="${e}">${e}</option>`,toUnitSelect.innerHTML+=`<option value="${e}">${e}</option>`}),t.length>1&&(toUnitSelect.selectedIndex=1),convertUnit()}
function convertUnit(){const e=conversionTypeSelect.value,t=parseFloat(document.getElementById("inputValue").value)||0,n=fromUnitSelect.value,o=toUnitSelect.value;let l=0;if("temperature"===e){let e;l="Celsius"===n?t:"Fahrenheit"===n?(t-32)*5/9:t-273.15,"Celsius"===o?l:("Fahrenheit"===o?l*9/5+32:l+273.15)}else l=t*conversionFactors[e][n]/conversionFactors[e][o];document.getElementById("conversionResult").textContent=l.toFixed(4)}

// --- ऐप शुरू होने पर पहली बार फंक्शन्स को कॉल करना ---
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay();
    updateHistoryDisplay();
    calculateGST();
    calculateDiscount();
    switchBmiUnits();
    updateUnits();
});