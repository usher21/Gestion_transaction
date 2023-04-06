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
            { num: 1, date: '12/08/2019', sens: 1, montant: 3600 }
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
            { num: 1, date: '12/08/2019', sens: 1, montant: 95000 }
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
            { num: 1, date: '12/08/2019', sens: 1, montant: 22400 }
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
            { num: 1, date: '12/08/2019', sens: 1, montant: 5750 }
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
const telephone = document.querySelector('#tel')
const saveTransactionBtn = document.querySelector('button')

const searchResults = document.querySelector('.search-result')

/*-------------------------------------------------------------------------*/

const clientModal = document.querySelector('.modal-container')
const saveClient = document.querySelector('.save')
const openModal = document.querySelector('.open-modal')
const closeModal = document.querySelector('.cancel')

const clientFirstName = document.querySelector('#client-firstname')
const clientLastName = document.querySelector('#client-lastname')
const clientEmail = document.querySelector('#client-email')
const clientPhone = document.querySelector('#client-phone')

const firstNameError = document.querySelector('.firstname-error')
const lastNameError = document.querySelector('.lastname-error')
const emailError = document.querySelector('.email-error')
const phoneError = document.querySelector('.phone-error')

const searchClient = document.querySelector('#search-client')
const listResultClient = document.querySelector('.list-result-client')

const confirmModalContainer = document.querySelector('.modal-confirm-container')
const no = document.querySelector('.no')
const yes = document.querySelector('.yes')

let confirmAnswer = 0
let transId = 0

/*-------------------------------------------------------------------------*/

/*------------------------------------------------------------------------------------------------------------------------------*/

form.style.display = 'none'
transactionBody.innerHTML = ''

let index = 0
let minAmount = 500

generateUser(users[index])

/*------------------------------------------------------------------------------------------------------------------------------*/

nextBtn.addEventListener('click', () => {
    index = Math.floor(Math.random() * users.length)
    generateUser(users[index])
})

btnDetail.addEventListener('click', () => {
    amountInput.value = minAmount
    if (getComputedStyle(form).display == 'block')
        form.style.display = 'none'
    else
        form.style.display = 'block'
})

amountInput.addEventListener('input', () => {
    amountInput.style.color = '#414141'

    if (!amountInput.value)
        amountInput.value = ''
    
    if(+amountInput.value < 500)
        amountInput.style.color = 'orangered'
})

saveTransactionBtn.addEventListener('click', () => {

    if (!amountInput.value) {
        showAlertMessage('!!! Entrer le montant de la transaction !!!')
        return
    }

    const amount = +amountInput.value

    let sens = transSelect.value == 'd' ? 1 : -1

    if (amount < minAmount) {
        showAlertMessage('Le montant de la transaction doit être au minimum ' + minAmount)
        return
    }

    if (transSelect.value == 'r') {
        if (amount > users[index].solde) {
            showAlertMessage('Vous ne disposez pas de solde nécéssaire pour éffectuer cette transaction')
            return
        }
        withdrawMoney(users[index].telephone, amount)
    } else if (transSelect.value == 'd') {
        if (telephone.value) {
            sens = 2
            if (amount > users[index].solde) {
                showAlertMessage('Vous ne disposez pas de solde nécéssaire pour éffectuer cette transaction')
                return
            }
            if (!validPhone(telephone.value)) {
                showAlertMessage('Erreur ! Le numéro de téléphone indiqué n\'est pas valide')
                return
            }
            users[index].solde -= amount
            if (phoneExists(telephone.value)) {
                transId++
                let newTransaction = getTransactionObject(users[index].telephone, sens, amount, '', transId, telephone.value)
                sendMoneyTo(telephone.value, amount)
                saveTransaction(users[index].telephone, newTransaction)

                let newTransactionForDestination = getTransactionObject(telephone.value, 1, amount, '', transId, '')
                saveTransaction(telephone.value, newTransactionForDestination)
                generateUser(users[index])
                console.log(users);
                return
            } else {
                cancelTransaction(users[index].telephone, amount)
            }
        } else {
            users[index].solde += amount
        }
    }

    const transactionObject = getTransactionObject(users[index].telephone, sens, amount, '', -1, telephone.value)
    saveTransaction(users[index].telephone, transactionObject)
    generateUser(users[index])
    clearInput(amountInput, telephone)
    console.log(users);
})

telephone.addEventListener('input', () => {
    const searchValue = telephone.value

    searchResults.innerHTML = ''
    searchResults.classList.remove('active')

    if (searchValue != '') {
        searchResults.classList.add('active')
        showResultItem(users, searchValue)
    }
})

openModal.addEventListener('click', () => {
    clearInput(clientFirstName, clientLastName, clientEmail, clientPhone)
    clientModal.classList.remove('hide')
})
closeModal.addEventListener('click', () => clientModal.classList.add('hide'))

clientEmail.addEventListener('input', () => {
    emailError.innerText = 'Veuillez saisir l\'email du  client'

    if (clientEmail.value != '') {
        emailError.innerText = ''
    }
})

clientFirstName.addEventListener('input', () => {
    firstNameError.innerText = 'Veuillez saisir le prénom du  client'

    if (clientFirstName.value != '') {
        firstNameError.innerText = ''
    }
})

clientLastName.addEventListener('input', () => {
    lastNameError.innerText = 'Veuillez saisir le nom du  client'

    if (clientLastName.value != '') {
        lastNameError.innerText = ''
    }
})

clientPhone.addEventListener('input', () => {
    phoneError.innerText = 'Veuillez saisir le numéro téléphone du  client'

    if (clientPhone.value != '') {
        phoneError.innerText = ''
    }
})

saveClient.addEventListener('click', () => {

    if (!isInputFilled()) {
        return
    }

    if (!validEmail(clientEmail.value)) {
        emailError.innerText = "L'addresse email n'est pas valide"
        return
    }

    for (const user of users) {
        if (user.email.toLocaleLowerCase().trim() == clientEmail.value) {
            emailError.innerText = "L'addresse email existe déjà"
            return
        }
    }
    emailError.innerText = ""

    if (!validPhone(clientPhone.value)) {
        phoneError.innerText = "Le numéro de téléphone indiqué n'est pas valide"
        return
    }

    if (phoneExists(clientPhone.value)) {
        phoneError.innerText = "Ce numéro de téléphone existe déjà"
        return
    }
    phoneError.innerText = ''

    const client = {
        firtsName: clientFirstName.value,
        lastName: clientLastName.value,
        telephone: clientPhone.value,
        email: clientEmail.value,
        img: './img/notfound.jpg',
        solde: 0,
        transactions: []
    }

    users.push(client)
    clearInput(clientFirstName, clientLastName, clientEmail, clientPhone)
    closeModal.click()
})

searchClient.addEventListener('input', () => {
    listResultClient.innerHTML = ''

    if (searchClient.value != '') {
        showClientItems(searchClient.value)
    }
})

/*------------------------------------------------------------------------------------------------------------------------------*/

function phoneExists(telephone) {
    for (const user of users) {
        if (trimMiddleSpace(user.telephone) == trimMiddleSpace(telephone)) {
            return true
        }
    }
    return false
}

function isInputFilled() {
    let filled = false

    if (clientFirstName.value == '') {
        firstNameError.innerText = 'Veuillez saisir le prénom du  client'
    } else if (clientLastName.value == '') {
        lastNameError.innerText = 'Veuillez saisir le nom du  client'
    } else if (clientEmail.value == '') {
        emailError.innerText = 'Veuillez saisir l\'email du  client'
    } else if (clientPhone.value == '') {
        phoneError.innerText = 'Veuillez saisir le numéro téléphone du  client'
    } else {
        filled = true
    }

    return filled
}

function validEmail(email) {
    return /[a-zA-Z_.-]+[0-9]*@[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,}/.test(email)
}

function validPhone(phone) {
    return /[7]{1}[7|8|6|5|0]{1} ?[0-9]{3} ?[0-9]{2} ?[0-9]{2}/.test(phone)
}

function clearInput(...inputs) {
    for (const input of inputs) {
        input.value = ''
    }
}

function createClientItem(fullname, image) {
    const li = createElement('li', { class: 'client-result-item' })

    const fullName = createElement('span', { class: 'fullname' }, fullname)
    const img = createElement('span', { class: 'image' })
    img.style.backgroundImage = `url(${image})`

    li.append(fullName, img)

    return li
}

function showClientItems(clientName) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].lastName.toLocaleLowerCase().includes(clientName.toLocaleLowerCase()) ||
            users[i].firtsName.toLocaleLowerCase().includes(clientName.toLocaleLowerCase()) ||
            `${users[i].firtsName} ${users[i].lastName}`.toLocaleLowerCase().includes(clientName.toLocaleLowerCase()) ||
            `${users[i].lastName} ${users[i].firtsName}`.toLocaleLowerCase().includes(clientName.toLocaleLowerCase())) {
            const clientItem = createClientItem(`${users[i].firtsName} ${users[i].lastName}`, users[i].img)
            listResultClient.appendChild(clientItem)
            clientItem.addEventListener('click', () => {
                generateUser(users[i])
                index = i
                listResultClient.innerHTML = ''
                searchClient.value = ''
            })
        }
    }
}

function generateUser(user) {
    const photoContainer = document.querySelector('.photo')
    photoContainer.innerHTML = ''

    lastName.innerText = user.lastName
    firtsName.innerText = user.firtsName
    phone.innerText = user.telephone
    email.innerText = user.email
    const img = new Image()
    img.src = user.img
    photoContainer.innerHTML = img.outerHTML
    solde.innerText = user.solde + ' FCFA'

    if (user.img == './img/notfound.jpg') {
        const img = createElement('div', { class: 'choose-image' }, 'Choisir une image')
        const inputFile = document.querySelector('#upload-file')

        img.addEventListener('click', () => inputFile.click())
        photoContainer.appendChild(img)

        uploadFile(inputFile, photoContainer, user)
    }

    transactionBody.innerHTML = ''
    transactionNumber.innerText = user.transactions.length

    for (const transaction of user.transactions) {
        const transactionLine = createTransactionLine(transaction)
        transactionBody.appendChild(transactionLine)
    }
}

function uploadFile(inputFile, container, user) {
    inputFile.addEventListener('change', () => {
        const file = inputFile.files[0]
        const reader = new FileReader()

        reader.readAsDataURL(file)

        reader.addEventListener('load', () => {
            const image = new Image()
            image.src = reader.result
            user.img = image.src
            container.innerHTML = ''
            container.appendChild(image)
        })
    })
}

function createElement(tagName, attributes = {}, content = '') {
    const element = document.createElement(tagName)
    for (const key in attributes) {
        element.setAttribute(key, attributes[key])
    }
    element.innerText = content
    return element
}

function createResultItem(userLastName, phone) {
    const resultItem = createElement('div', { class: 'result-item' })
    const userName = createElement('span', { class: 'name' }, userLastName)
    const userPhone = createElement('span', { class: 'tel' }, phone)
    resultItem.append(userName, userPhone)
    return resultItem
}

function showResultItem(users, searchValue) {
    for (const user of users) {
        if (trimMiddleSpace(user.telephone).startsWith(trimMiddleSpace(searchValue))) {
            const resultItem = createResultItem(user.firtsName, user.telephone)
            resultItem.addEventListener('click', () => {
                telephone.value = trimMiddleSpace(user.telephone)
                searchResults.classList.remove('active')
            })
            searchResults.appendChild(resultItem)
        }
    }
    if (searchResults.childElementCount == 0) {
        searchResults.classList.remove('active')
    }
}

function createTransactionLine(transaction) {
    const line = createElement('tr')
    const transactionNumber = createElement('td', {}, transaction.num)
    const date = createElement('td', {}, transaction.date)
    const sens = createElement('td', {}, 'Retrait')
    sens.style.backgroundColor = 'orangered'
    let btnCanceled = null

    if (transaction.sens == 1) {
        sens.innerText = 'Dépôt'
        sens.style.backgroundColor = '#2ecc71'
    } else if (transaction.sens == 2) {
        sens.innerText = 'Envoie'
        sens.style.backgroundColor = '#2ecc71'
        if (transaction.etat != 'canceled') {
            btnCanceled = createElement('button', { class: 'btn-canceled' }, 'x')
            listenerEvent(btnCanceled, transaction)
            sens.appendChild(btnCanceled)
        }
    }

    const amount = createElement('td', {}, transaction.montant)

    if (transaction.etat == 'canceled') {
        transactionNumber.style.textDecoration = 'line-through red'
        date.style.textDecoration = 'line-through red'
        sens.style.textDecoration = 'line-through red'
        amount.style.textDecoration = 'line-through red'
    }

    line.append(transactionNumber, date, sens, amount)

    return line
}

function listenerEvent(btn, transaction) {
    btn.addEventListener('click', () => {
        confirmModalContainer.classList.remove('hide')
        no.addEventListener('click', () => confirmModalContainer.classList.add('hide'))
        
        yes.addEventListener('click', () => {
            confirmModalContainer.classList.add('hide')
            if (transaction.etat != 'canceled') {
                withdrawMoney(transaction.destinationNum, transaction.montant)
                saveTransaction(transaction.destinationNum, getTransactionObject(transaction.destinationNum, -1, transaction.montant, '', -1, ''))
                transaction.etat = 'canceled'
                users[index].solde += transaction.montant
                generateUser(users[index])
            }
        })
        
    })
}

function getTransactionNumber(userphone) {
    for (const user of users) {
        if (trimMiddleSpace(user.telephone) == trimMiddleSpace(userphone)) {
            if (user.transactions.length == 0)
                return 1
            return user.transactions[user.transactions.length - 1].num + 1
        }
    }
}

function getTransactionObject(userPhone, sens, montant, etat, id, destinationNum) {
    return {
        num: getTransactionNumber(userPhone),
        date: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        sens,
        montant,
        etat,
        id,
        destinationNum,
    }
}

function getUserByPhone(userPhone) {
    return users.find(user => trimMiddleSpace(user.telephone) == trimMiddleSpace(userPhone))
}

function saveTransaction(userPhone, transactionObject) {
    for (const user of users) {
        if (trimMiddleSpace(user.telephone) == trimMiddleSpace(userPhone)) {
            user.transactions.push(transactionObject)
            return
        }
    }
}

function sendMoneyTo(destinationNum, amount) {
    for (let i = 0; i < users.length; i++) {
        if (trimMiddleSpace(users[i].telephone) == trimMiddleSpace(destinationNum)) {
            users[i].solde += amount
            return
        }
    }
}

function withdrawMoney(userPhone, amount) {
    for (const user of users) {
        if (trimMiddleSpace(user.telephone) == trimMiddleSpace(userPhone)) {
            user.solde -= amount
            return
        }
    }
}

function cancelTransaction(telephone, amount) {
    setTimeout(() => {
        for (const user of users) {
            if (trimMiddleSpace(user.telephone) == trimMiddleSpace(telephone)) {
                user.transactions[user.transactions.length - 1].etat = 'canceled'
                user.solde += amount
                generateUser(users[index])
            }
        }
    }, 10000);
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

function showAlertMessage(message) {
    alertMessage.innerText = message
    alertMessage.classList.remove('inactive');
    alertMessage.classList.add('active')
    setTimeout(() => {
        alertMessage.classList.remove('active');
        alertMessage.classList.add('inactive');
    }, 3000);
}

/*------------------------------------------------------------------------------------------------------------------------------*/