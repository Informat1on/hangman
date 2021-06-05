const image = $('image#k1');
const words = [
    'Игра','Ночь','Зима','Университет','Крышка'
];
//показываю случайное слово
let randIndex = Math.floor(Math.random() * words.length);
let arr = words[randIndex].split('');

//указатель картинки с виселицей
let imgPtr = 1;

//nickname
let nick = 'none';
//player id
//для того чтобы в конце игры перезаписывать кол-во очков (в начале ставим заглушку - 0 очков)
let playerId = 1;

//canvas
const canvas = $('#img')[0];
canvas.width = 468;
canvas.height = 830;
const ctx = canvas.getContext('2d');

//img
const imgWidth = 468;
const imgHeigh = 830;

//очки
let winCount = 0;

function showUnderLine(word){
    //получаю количество букв в слове, чтобы нарисовать inputfield
    let wordCount = word.length;
    console.log(wordCount);

    //генерирую нижние подчеркивания
    for (let i = 0; i < wordCount; i++){
        $("#word-line").append("<div class='underline'>_</div>");
    }
}

//проверяю букву пользователя
function submitWord(){
    //проверка на нахождение буквы
    let foundMatch = false;
    //получаю значение введенной буквы
    let inputWord = $("#word-write-input").val();
    //output
    console.log(inputWord);

    //перебор по всем буквам загаданного слова
    for (let i=0; i < words[randIndex].length ; i++){
        //если нашло совпадение, то показываем букву вместо черточек
        if (inputWord === words[randIndex][i] || inputWord.toUpperCase() === words[randIndex][i]){
            //и если буква еще не открыта
                foundMatch = true;
            if(!isWordOpened(inputWord)) {
                winCount += 10;
            }
                //вывожу в консоль что нашло соответствие
                console.log("fount match at ", inputWord, winCount);
                //отображаю букву вместо черточки
                $(".underline")[i].textContent = words[randIndex][i];
                //обновляю очки
                showScore(winCount);


        }
    }
    if (isAllOpened()) {
        console.log("full word!");
        //рефреш и перейти на следующее слово, но с сохранением очков
        refresh(winCount);
        return true;
    }

    //нашел ли пользователь букву
    //если не нашел
    if (!foundMatch){
        //меняю изображение на следующее
        imgPtr++;
        //если это последняя стадия виселицы - конец
        if (imgPtr > 7) {
            //игра заканчивается
            //ваш рекорд -
            //ставлю кол-во очков в форме
            $('div#win_count').html(winCount);
            console.log("game is over, count win is ",winCount);
            //показываю форму
            $("#popup-looser").css({'display':'block'});
            //обновляю таблицу с пользователем
            //удаляю запись
            $("#player"+`${playerId}`).remove();
            //добавляю новую
            $("#add-table").append(`<tr id="player${playerId}"><th>${nick}</th><th>${winCount}</th></tr>`);
            //добавляю в словарь нового игрока
            //берем словарь с кеша
            let playerDict = JSON.parse(localStorage.getItem('players'));
            //добавляем туда нового игрока
            playerDict[nick] = winCount;
            //добавляем в локальное хранилище
            localStorage.setItem('players',JSON.stringify(playerDict));
            //выводим
            console.log(playerDict);
            return true;
        }
        //отрисовка изображения
        showImg(imgPtr);
    }
}

//вывод полностью слова (не используется)
function printWords(arr){
    console.log(arr.length);
    console.log(arr);
    for (let i = 0; i < arr.length; i++){
        $(".underline")[i].textContent = arr[i];
    }
}

//показать виселицу
function showImg(imgPtr){
    let img = new Image();
    img.src = `images/k${imgPtr}.png`
    img.onload = function drawImg() {

        ctx.clearRect(0, 0, imgWidth, imgHeigh);  // очищаю поле для вставки картинки

        ctx.drawImage(img, 0, 0,imgWidth,imgHeigh); // рисую на нем картинку
    };
}

//новая игра
function refresh(score){
    //скрываю меню
    $('#popup-looser').css({'display': 'none'});

    //перерисовываю картинку
    imgPtr = 1;
    showImg(imgPtr);

    //обнуляю/устанавливаю баланс
    winCount = score;
    showScore(score);

    //показываю новое случайное слово
    randIndex = Math.floor(Math.random() * words.length);
    arr = words[randIndex].split('');

    //сбрасываю черточки
    $('#word-line').html("");
    //показываю черточки
    showUnderLine(words[randIndex])
    //сбрасываю старый ввод
    $("#word-write-input").val("");

}

//все ли открыты
function isAllOpened() {
    //массив всех символов
    let chars = $(".underline");
    for (let i=0; i<arr.length;i++){
        //если не все открыто
        if(chars[i].textContent === "_")
            return false;
    }
    return true;
}

//если уже буква открыта - чтобы не было накрутки очков за одну и ту же букву
function isWordOpened(word){
    //массив всех символов
    let chars = $(".underline");
    for (let i=0; i<arr.length;i++){
        //если буква уже открыта
        if(chars[i].textContent === word || chars[i].textContent.toUpperCase() === word)
            return true;
    }
    return false;
}

//показ очков
function showScore(score){
    $("#score-count").html(score);
}

//добавление ника в таблицу
function addNick(){
    //считываем введенный ник
    nick = $("#nick-input").val();

    //добавляем в таблицу, но без очков
    $("#add-table").append(`<tr id="player${playerId}"><th>${nick}</th><th>0</th></tr>`);

    //скрываем поле
    $("#popup-name").css({'display':'none'});
}

function showInputField() {
    $("#popup-name").css({'display':'block'});
}

//загрузка таблицы
function loadTable(){
    console.log('Loading table..');
    //получаю словарь игроков и очков
    let playerDict = JSON.parse(localStorage.getItem('players'));
    console.log('Loaded dict is ...',playerDict);

    //перебор по циклу
    //вывод каждого игрока и кол-во очков
    for (const [key, value] of Object.entries(playerDict)) {
        $("#add-table").append(`<tr><th>${key}</th><th>${value}</th></tr>`);
    }

}

// ----ON START---- //
//показываю случайное слово
showUnderLine(words[randIndex]);
//показываю при старте изображение
showImg(imgPtr);
//показываю при старте очки
showScore(winCount);
//покакзываю поле ввода
showInputField();
//загрузка таблицы
loadTable();

