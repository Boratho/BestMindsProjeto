const firebaseConfig = {
    apiKey: "AIzaSyABzuGEqITtDJHH7iZiPD6VVJgGRd6SiWI",
    authDomain: "bdnunessports.firebaseapp.com",
    projectId: "bdnunessports",
    storageBucket: "bdnunessports.appspot.com",
    messagingSenderId: "1036281284229",
    appId: "1:1036281284229:web:65e845ba905955b9fd4bec"
};

const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

let products = [];

displayProducts();
closeForm();
cleanField();

function openSpin() {
    let spinner=document.getElementById("spinner")
    spinner.style.display = 'flex';
}

function closeSpin() {
    let spinner=document.getElementById("spinner")
    spinner.style.display = 'none';
}

function openForm() {
    let modal = document.getElementById('modal');
    modal.style.display = 'block'
}

function closeForm() {
    let modal = document.getElementById('modal');
    modal.style.display = 'none';
    cleanField();
}

function formatCurrency(value) {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    return formatter.format(value);
}

function addProduct() {
    const productName = document.getElementById("productName").value;
    const productCode = document.getElementById("productCode").value;
    const productDescription = document.getElementById("productDescription").value;
    const productPrice = document.getElementById("productPrice").value;

    if (!productName || !productCode || !productDescription || !productPrice) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    db.collection("Produtos").doc(productCode).set({
        code: productCode,
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice)
    })
    .then((result) => {
        const successToast = new bootstrap.Toast(document.getElementById('successToast'), {
            animation: true,
            autohide: true,
            delay: 700
        });
        successToast.show();
    })
    .catch((error) => {
        console.error("Erro ao adicionar Objeto", error);
    });

    displayProducts();
    closeForm();
    cleanField();   
}

function displayProducts() {
    openSpin()
    const tableBody = document.querySelector("#productTable tbody");
    const tableHeader = document.querySelector("#productTable thead");
    products = []
    db.collection("Produtos").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            let newProduct = {
                name: doc.data().name,
                code: doc.data().code,
                description: doc.data().description,
                price: doc.data().price,
            };

            products.push(newProduct);
            console.table(`${doc.id} => ${newProduct.name}`);
            console.table(`${doc.id} => ${newProduct.code}`);
            console.table(`${doc.id} => ${newProduct.description}`);
            console.table(`${doc.id} => ${newProduct.price}`);
        });
    });

    setTimeout(() => {
        tableBody.innerHTML = "";
        if (products.length === 0) {
            tableHeader.style.display = "none";
            const noRecordRow = tableBody.insertRow(0);
            const cell = noRecordRow.insertCell(0);
            cell.colSpan = 4;
            cell.textContent = "Sem registro";
        } else {
            tableHeader.style.display = "table-header-group";

            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                const row = tableBody.insertRow(i);
                row.innerHTML = `<td>${product.code}</td><td>${product.name}</td><td>${formatCurrency(product.price)}</td><td>${product.description}</td><td class="action-cell"><button class="btn btn-outline-primary btn-sm action-button" onclick="editProduct(${i})">Editar</button><button class="btn btn-outline-primary btn-sm action-button" onclick="deleteProduct(${i})">Excluir</button></td>`;
                }
        }
        closeSpin()
    }, 1000); 
}

function editProduct(index) {
    const product = products[index];
    document.getElementById("productName").value = product.name;
    document.getElementById("productCode").value = product.code;
    document.getElementById("productDescription").value = product.description;
    document.getElementById("productPrice").value = product.price;

    const productName = document.getElementById("productName").value;
    const productCode = document.getElementById("productCode").value;
    const productDescription = document.getElementById("productDescription").value;
    const productPrice = document.getElementById("productPrice").value;

    openForm();

    let updateProduct = db.collection("Produtos").doc(product.code);

    updateProduct.update({
        code: productCode,
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice)
    })
    .then(() => {
        console.log("Atualizado com sucesso!");
    })
    .catch((error) => {
        console.error("Erro de atualização", error);
    });

    displayProducts();
}

function deleteProduct(index) {
    const product = products[index];
    console.table(product);
    db.collection("Produtos").doc(product.code).delete().then(() => {
        console.log("Sucesso em deletar!");
    }).catch((error) => {
        console.error("Erro ao movimentar conteudo", error);
    });

    displayProducts();
}

document.getElementById("addProductForm").addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        addProduct();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeForm();
    }
});

function cleanField() {
    document.getElementById("productName").value = "";
    document.getElementById("productCode").value = "";
    document.getElementById("productDescription").value = "";
    document.getElementById("productPrice").value = "";
}
