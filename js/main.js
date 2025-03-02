//!Ay dizisi
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

//!html den javascrpte cekilen elemanlar
const addBox = document.querySelector (".add-box");
const popupBoxContainer = document.querySelector(".popup-box");
const popupBox = document.querySelector(".popup");
const closeBtn = document.querySelector ("#close-btn");
const form = document.querySelector("form");
const wrapper = document.querySelector(".wrapper");
let popupTitle = document.querySelector("header p");
let submitBtn = document.querySelector("#submit-btn");

console.log(popupTitle);
console.log(submitBtn);


//!localstorage dan note verilerini al eger localstorage da note yoksa bunun baslangic degerini bos dizi olarak belirle
let notes = JSON.parse(localStorage.getItem("notes")) || [];

let isUpdate = false;
let updateId = null;



//sayfa yuklendiginde notlari render eden fonksiyonu calistir
document.addEventListener('DOMContentLoaded',()=>{
    renderNotes(notes);
})

//*addBox elemanina tiklaninca popupi ac

addBox.addEventListener("click",()=> {

    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");

    //bodyin kaydirilmasini engelle
    document.querySelector("body").style.overflow = "hidden";
});

//closeBtn e tiklaninca popup i kapat
closeBtn.addEventListener("click",()=> {
    //popupBoxContainer && popupBox ekrandan gizlemek icin show classini kaldir

    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");


    //bodyin kaydirilmasini autoya cevir
    document.querySelector("body").style.overflow = "auto";

    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";


  form.reset();


    
});


//formun gonderilmesini izle

form.addEventListener("submit",(e)=> {
    //formun sayfa yenilemesini engelle
    e.preventDefault();

    //form icerisindeki input ve textareaya eris
    titleInput = e.target[0];
    descriptionInput = e.target[1];

    //input ve textarea nin degerlerine eris ve basinda sonunda bosluk varsa kaldir

    let title = titleInput.value.trim();
    let description = descriptionInput.value.trim();

 
    //eger inputlar bos birakilmissa uyari ver
    if(!title && !description){
      alert("Lutfen formdaki gerekli kisimlari doldurunuz !");
    
    return;//Burada return kullanimi ile if blogu calistiktan sonra kodun devam etmesini engelledik
    }

    //Tarih verisini olustur
   const date = new Date();

   //Gun ay yil ve id degerlerini olustur
   const day = date.getDate();
   const month = months[date.getMonth()];
   const year = date.getFullYear();
   const id = date.getTime();


   if(isUpdate){

    const findIndex = notes.findIndex((note) => note.id == updateId);

    notes[findIndex] = {
        title,description,id,date:`${month} ${day},${year}`,
    };

    isUpdate = false;
    updateId = null;
    popupTitle.textContent = "New Note";
    submitBtn.textContent = "Add Note";

   }else{
    let noteInfo = {
        id,
        title,
        description,
        date:`${month} ${day},${year}`,
    };
    //noteinfoyu note dizisine ekle
    notes.push(noteInfo);
   }
  
//localStorage not dizisini ekle
localStorage.setItem('notes',JSON.stringify(notes));
//input ve textarea elemanlarinin icerigini temizle
  form.reset();

    //popupBoxContainer && popupBox ekrandan gizlemek icin show classini kaldir

    popupBoxContainer.classList.remove("show");
    popupBox.classList.remove("show");


    //bodyin kaydirilmasini autoya cevir
    document.querySelector("body").style.overflow = "auto";
});


//notlari arayuze render edecek fonsiyon

function renderNotes(notes) {
    document.querySelectorAll(".note").forEach((li) => li.remove());
//note dizisindeki herbir elemani don
    notes.forEach((note)=>{
     //note dizisindeki herbir eleman icin birer note olustur   
        let noteEleman=  `<li class="note" data-id='${note.id}'>
        <!-- Note Details -->
         <div class="details">
            <!-- Title && Description -->
            <p class="title">${note.title}</p>
            <p class="description">${note.description}</p>
         </div>
         <!-- Bottom -->
          <div class="bottom">
            <span>${note.date}</span>
            <div class="settings">
                <!-- Icon -->
                <i class='bx bx-dots-horizontal-rounded'></i>
                <!-- Menu -->
                 <ul class="menu">
                <li class='editIcon'<i class='bx bxs-edit' ></i>Duzenle</li>
                <li class='deleteIcon'<i class='bx bx-trash' ></i>Sil</li>
                    
                 </ul>
            </div>
          </div>
    </li>`;

   addBox.insertAdjacentHTML("afterend", noteEleman);
    });
}

//Menu kisminin gorunurlugunu ayarlayan fonkisyon

function showMenu(eleman){
    //disaridan gelen elemanin kapsayicisina show classini ekle
    eleman.parentElement.classList.add("show");

    //Eklenen show classini uc nokta haricinde bir yere tiklanirsa kaldir
   document.addEventListener("click",(e) => {


    if(e.target.tagName != "I" || e.target != eleman){
        eleman.parentElement.classList.remove("show");

    }
   });
}

//*Wrapper kismindaki tiklanmalari izle

wrapper.addEventListener("click",(e) => {
if(e.target.classList.contains("bx-dots-horizontal-rounded")){
 //showmenu fonksiyonu calistir  
showMenu(e.target);
}

//eger sil iconuna tiklandiysa 

else if(e.target.classList.contains("deleteIcon")) {
    const res = confirm("Bu notu silmek istediginize emin misiniz?");

    if(res) {
        const note = e.target.closest(".note");


      const notedId = parseInt(note.dataset.id);

      notes = notes.filter((note) => note.id != notedId);

      localStorage.setItem("notes",JSON.stringify(notes));

      renderNotes(notes);
}
}

else if (e.target.classList.contains("editIcon")) {
    const note = e.target.closest(".note");
    const noteId = parseInt(note.dataset.id);

    const foundedNote = notes.find((note) => note.id == noteId);


    isUpdate = true;
    updateId = noteId;


    popupBoxContainer.classList.add("show");
    popupBox.classList.add("show");


    form[0].value = foundedNote.title;
    form[1].value = foundedNote.description;

    popupTitle.textContent = "Update Note";
    submitBtn.textContent = "Update";

    
}
});

