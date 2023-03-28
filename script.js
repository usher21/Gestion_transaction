const users = [
    {
        firtsName: 'Usher',
        lastName: 'Blow',
        telephone: '78 389 98 60',
        email: 'usherblow21@gmail.com',
        img: './img/img7.jpg',
        solde: 50000,
        transactions: [
            { num: 1, date: '12/08/2019', sens: 1, montant: 23500 }
        ]
    },
    {
        firtsName: 'Akasa',
        lastName: 'Fall',
        telephone: '77 776 88 34',
        email: 'akasa@gmail.com',
        img: './img/img2.jpg',
        solde: 34600,
        transactions: [
            { num: 1, date: '12/08/2019', sens: 1, montant: 23500 }
        ]
    },
    {
        firtsName: 'Aicha',
        lastName: 'Mané',
        telephone: '70 543 23 87',
        email: 'aicha999@gmail.com',
        img: './img/img8.jpg',
        solde: 18500,
        transactions: [
            { num: 1, date: '12/08/2019', sens: 1, montant: 23500 }
        ]
    },
    {
        firtsName: 'Travel',
        lastName: 'Julian',
        telephone: '76 098 40 27',
        email: 'julian@gmail.com',
        img: './img/img1.jpg',
        solde: 123000,
        transactions: [
            { num: 1, date: '12/08/2019', sens: 1, montant: 23500 }
        ]
    },
    {
        firtsName: 'Mama',
        lastName: 'Coly',
        telephone: '77 098 00 23',
        email: 'colymama@gmail.com',
        img: './img/img6.jpg',
        solde: 79500,
        transactions: [
            { num: 1, date: '12/08/2019', sens: 1, montant: 23500 }
        ]
    },
    {
        firtsName: 'Burundi',
        lastName: 'Abla',
        telephone: '76 090 12 30',
        email: 'abla@gmail.com',
        img: './img/img5.jpg',
        solde: 12500,
        transactions: [
            { num: 1, date: '12/08/2019', sens: 1, montant: 23500 }
        ]
    }
]

/*------------------------------------------------------------------------------------------------------------------------------*/

const lastName = document.querySelector('#lastname')
const firtsName = document.querySelector('#firstname')
const phone = document.querySelector('#phone')
const email = document.querySelector('#email')
const image = document.querySelector('img')

const nextBtn = document.querySelector('.next')
const btnDetail = document.querySelector('#btnDetail')

const transactionBody = document.querySelector('tbody')
const transactionNumber = document.querySelector('code')
const solde = document.querySelector('#solde')
const alertMessage = document.querySelector('.alert')

const form = document.querySelector('.form')
const amountInput = document.querySelector('#mnt')
const transSelect = document.querySelector('#trans')
const saveTransactionBtn = document.querySelector('button')

/*------------------------------------------------------------------------------------------------------------------------------*/

form.style.display = 'none'
transactionBody.innerHTML = ''

let index = 0
let minAmount = 500

generateUser()

/*------------------------------------------------------------------------------------------------------------------------------*/

nextBtn.addEventListener('click', () => {
    index = Math.floor(Math.random() * users.length)
    generateUser()
})

btnDetail.addEventListener('click', () => {
    amountInput.value = minAmount
    if (getComputedStyle(form).display == 'block')
        form.style.display = 'none'
    else
        form.style.display = 'block'
})

amountInput.addEventListener('input', () => {
    if (!amountInput.value)
        amountInput.value = ''
})

transSelect.addEventListener('change', () => {
    if (transSelect.value == 'e') {
        saveTransactionBtn.insertAdjacentElement('beforebegin', createFormGroup())
    } else {
        if (document.querySelector('#tel'))
            saveTransactionBtn.previousElementSibling.remove()
    }
})

console.log(navigator.onLine);

saveTransactionBtn.addEventListener('click', () => {

    if (amountInput.value) {
        const amount = +amountInput.value
        const numDestination = document.querySelector('#tel')
        let destinationNum = ''
        if (numDestination)
            destinationNum = trimMiddleSpace(numDestination.value)
        
        let sens = -1

        if (transSelect.value == 'd') {
            sens = 1
        } else if (transSelect.value == 'e') {
            sens = 2
        }

        if (amount < 500) {
            showAlertMessage('Le montant de la transaction doit être au minimum ' + minAmount)
            return
        }

        if (transSelect.value == 'r') {
            if (amount > users[index].solde) {
                showAlertMessage('Vous ne disposez pas de solde nécéssaire pour éffectuer cette transaction')
                return
            } else {
                users[index].solde = users[index].solde - amount
            }
        } else if (transSelect.value == 'e') {
            if (isValidNum(destinationNum)) {
                users[index].solde = users[index].solde - amount
                sendMoneyTo(destinationNum, amount)
            } else {

            }
        } else if (transSelect.value == 'd') {
            users[index].solde = users[index].solde + amount
        }

        const transactionObject = {
            num: getTransactionNumber(),
            date: new Date().toLocaleDateString(),
            sens,
            montant: amount,
        }

        saveTransaction(transactionObject)
        generateUser()
        amountInput.value = ''
        if (numDestination)
            numDestination.value = ''
    }
})

/*------------------------------------------------------------------------------------------------------------------------------*/

function generateUser() {
    lastName.innerText = users[index].lastName
    firtsName.innerText = users[index].firtsName
    phone.innerText = users[index].telephone
    email.innerText = users[index].email
    image.setAttribute('src', users[index].img)
    solde.innerText = users[index].solde + ' FCFA'

    transactionBody.innerHTML = ''
    transactionNumber.innerText = users[index].transactions.length
    for (const transaction of users[index].transactions) {
        const transactionLine = createTransactionLine(transaction.num, transaction.date, transaction.sens, transaction.montant)
        transactionBody.appendChild(transactionLine)
    }
}

function createElement(tagName, attributes = {}, content = '') {
    const element = document.createElement(tagName)
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    }
    element.innerText = content
    return element
}

function createTransactionLine(num, transDate, transSens, transAmount) {
    const line = createElement('tr')

    const transactionNumber = createElement('td', {}, num)
    const date = createElement('td', {}, transDate)
    const sens = createElement('td', {}, 'Retrait')

    sens.style.backgroundColor = 'orangered'

    if (transSens == 1) {
        sens.innerText = 'Dépôt'
        sens.style.backgroundColor = '#2ecc71'
    } else if (transSens == 2) {
        sens.innerText = 'Envoie'
        sens.style.backgroundColor = '#2ecc71'
    }

    const amount = createElement('td', {}, transAmount)

    line.append(transactionNumber, date, sens, amount)

    return line
}

function createFormGroup() {
    const formGroup = createElement('div', {class: 'form-group'})

    const label = createElement('label', {for: 'tel'}, 'Téléphone')
    const input = createElement('input', {type:"number", id:"tel", placeholder:"Téléphone...", class:"from-control"})

    formGroup.append(label, input)

    return formGroup
}

function getTransactionNumber() {
    return users[index].transactions[users[index].transactions.length - 1].num + 1
}

function saveTransaction(transactionObject) {
    users[index].transactions.push(transactionObject)
}

function sendMoneyTo(destinationNum, amount) {
    for (const user of users) {
        if (trimMiddleSpace(user.telephone) == destinationNum) {
            user.solde += amount
        }
    }
}

function withdrawMoney(amount, sens) {
    
}

function trimMiddleSpace(str) {
    let tempStr = ''
    for (const char of str) {
        if (char != ' ') {
            tempStr += char
        }
    }
    return tempStr
}

function isValidNum(num) {
    for (let i = 0; i < num.length; i++) {
        if (!(num[i] >= '0' && num[i] <= '9') && num[i] != ' ') {
            return false
        }
    }
    return true
}

function showAlertMessage(message) {
    alertMessage.innerText = message
    alertMessage.classList.add('active')
    setTimeout(() => {
        alertMessage.classList.remove('active');
        alertMessage.classList.add('inactive');
    }, 3000);
}

/*------------------------------------------------------------------------------------------------------------------------------*/