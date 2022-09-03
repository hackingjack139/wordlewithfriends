import { WORDS } from "./words.js";

let num_of_guesses = 6
let guesses_left = 6
let guess_row = 0
let guess_col = 0
let guessed_letters = new Set()
let win = false

// MUMMY

let correct_word = WORDS[Math.floor(Math.random() * WORDS.length)]
// let correct_word = "hinge"
// console.log(correct_word)
// let correct_word_set = new Set(correct_word)
// console.log(correct_word_set)
let correct_word_dict = {}
let correct_word_dict_copy = {}
for (let letter of correct_word) {
    if (!correct_word_dict[letter])
        correct_word_dict[letter] = 1
    else
        correct_word_dict[letter] += 1
}
console.log(correct_word_dict)

function init_board() {
    let board = document.getElementById("game-board")

    for (let i = 0; i < num_of_guesses; i++) {
        let row = document.createElement('div')
        row.className = "letter-row"
        for (let j = 0; j < 5; j++) {
            let cell = document.createElement('div')
            cell.className = 'letter-box'
            row.appendChild(cell)
        }
        board.appendChild(row)
    }
}

function init_keyboard() {
    let keyboard = document.getElementById("keyboard-cont")
    let first_row = Array.from("qwertyuiop".toUpperCase())
    let second_row = Array.from("asdfghjkl".toUpperCase())
    let third_row = ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Delete"]
    let keyboard_rows = [first_row, second_row, third_row]
    for (let i = 0; i < 3; i++) {
        let row = document.createElement('div')
        for (let j = 0; j < keyboard_rows[i].length; j++) {
            if (j == 1)
                row.className = "second-row"
            let key = document.createElement('button')
            key.className = "keyboard-button"
            key.textContent = keyboard_rows[i][j]
            row.appendChild(key)
        }
        keyboard.appendChild(row)
    }
}

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    if (win == true)
        return
    if (guesses_left == 0)
        return
    let pressed_key_target = e.target
    if (!pressed_key_target.classList.contains("keyboard-button")) {
        return
    }
    let pressed_key = pressed_key_target.textContent
    if (pressed_key.toUpperCase() === "ENTER") {
        check_guess()
    }
    else if (pressed_key == "Delete") {
        remove_letter()
    }
    else if (pressed_key.length == 1 && pressed_key.match(/[a-z]/gi))
        add_letter(pressed_key)
    else {
        return
    }
})

document.addEventListener("keyup", (e) => {
    if (win == true)
        return
    if (guesses_left == 0)
        return

    let pressed_key = String(e.key)
    if (pressed_key.toUpperCase() === "ENTER") {
        check_guess()
    }
    else if (pressed_key == "Backspace") {
        remove_letter()
    }
    else if (pressed_key.length == 1 && pressed_key.match(/[a-z]/gi))
        add_letter(pressed_key)
    else {
        return
    }
})

function add_letter(pressed_key) {
    if (guess_col == 5)
        return
    else {
        let board = document.getElementById("game-board")
        let current_row = board.children[guess_row]
        let current_cell = current_row.children[guess_col]
        current_cell.textContent = pressed_key
        guess_col += 1
    }
}

function remove_letter() {
    if (guess_col == 0)
        return
    guess_col -= 1
    let board = document.getElementById("game-board")
    let current_row = board.children[guess_row]
    let current_cell = current_row.children[guess_col]
    current_cell.textContent = ''
}

function check_guess() {
    if (guess_col != 5)
        alert("Enter 5 letters first!!!")
    else {
        for (let letter of correct_word) {
            if (!correct_word_dict_copy[letter])
                correct_word_dict_copy[letter] = 1
            else
                correct_word_dict_copy[letter] += 1
        }
        let board = document.getElementById("game-board")
        let current_row = board.children[guess_row]
        let current_guess = current_row.textContent.toLowerCase()
        console.log(current_guess)
        if (!WORDS.includes(current_guess)) {
            alert("Not a valid word!!!")
            return
        }
        if (correct_word == current_guess) {
            for (let i = 0; i < Array.from(current_guess).length; i++) {
                change_color_board(current_row.children[i], "green")
            }
            setTimeout(() => { alert("WIN!"); }, 100);
            // alert("WIN")
            win = true
        }
        else {
            let current_guess_array = Array.from(current_guess)
            console.log(correct_word_dict_copy)
            for (let j = 0; j < current_guess_array.length; j++) {
                for (let i = 0; i < current_guess_array.length; i++) {
                    let current_cell = current_row.children[i]
                    guessed_letters.add(current_guess_array[i])
                    // console.log(current_guess_array[i])

                    if (!correct_word_dict_copy[current_guess_array[i]]) {
                        change_color_board(current_cell, "grey")
                        change_color(current_guess_array[i], "grey")
                    }

                    if (correct_word_dict_copy[current_guess_array[i]]) {
                        // console.log(current_guess_array[i] + " is in the word")
                        if (current_guess[i] == correct_word[i]) {
                            change_color_board(current_cell, "green")
                            change_color(current_guess_array[i], "green")
                            correct_word_dict_copy[current_guess_array[i]] -= 1
                        }
                    }

                    if (correct_word_dict_copy[current_guess_array[i]] && j == (current_guess_array.length - 1)) {
                        // console.log(current_guess_array[i] + " is in the word")
                        if (current_guess[i] != correct_word[i]) {
                            change_color_board(current_cell, "yellow")
                            change_color(current_guess_array[i], "yellow")
                            correct_word_dict_copy[current_guess_array[i]] -= 1

                        }

                    }
                }


            }
            guess_row += 1
            guess_col = 0
            guesses_left -= 1
        }
    }
    if (guesses_left == 0) {
        alert("GAME OVER!!!")
        alert("Word was " + correct_word)
    }
}

function change_color_board(cell, color) {
    if (cell.style.backgroundColor == "green")
        return
    if (cell.style.backgroundColor == "yellow" && color != "green")
        return
    cell.style.backgroundColor = color
}

function change_color(letter, color) {
    for (let keyboard_button of document.getElementsByClassName("keyboard-button")) {
        if (keyboard_button.textContent == letter.toUpperCase()) {
            if (keyboard_button.style.backgroundColor == "green")
                return
            if (keyboard_button.style.backgroundColor == "yellow" && color != "green")
                return
            keyboard_button.style.backgroundColor = color
        }
    }
}

init_board()
init_keyboard()