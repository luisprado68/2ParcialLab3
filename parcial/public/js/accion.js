import {Anuncio_Auto } from "./anuncio.js";

    const div = document.getElementById('cont');
    let tabla = document.getElementById('tablita');
    const tbody = document.getElementById('tbody');
    const btnAlta = document.getElementById('alta');
    let listaAnuncios;
    let idModificar;
    let frm;
    const btnModificar = document.getElementById('btnModificar');
    const btnEliminar = document.getElementById('btnEliminar');
    const btnCancelar = document.getElementById('btnCancelar');
    btnCancelar.addEventListener('click', cancelar);

    function mostrarBotones(tr){
        
        if(tr){

            tr.addEventListener('click',function(e){
                idModificar=e.target.parentNode.id;
             
                document.getElementById('btnModificar').style.display = 'inline';
                document.getElementById('btnEliminar').style.display = 'inline';
                document.getElementById('btnCancelar').style.display = 'inline';
             
                
                buscarElemento(e.target.parentNode.id);
                
                btnModificar.addEventListener('click', modificarAnuncio);
                
                btnEliminar.addEventListener('click', bajaAnuncio);
            });
        
        }
        
    }

    function buscarElemento(id){
        
        listaAnuncios.forEach(element => {
                
            if(element['id'] == id){
    
                document.getElementById('txtTitulo').value = element['titulo'];
                frm.transaccion.value = element['transaccion'];
                document.getElementById('txtDescripcion').value = element['descripcion'];
                document.getElementById('txtPrecio').value = element['precio'];
                document.getElementById('txtPuertas').value = element['puertas'];
                document.getElementById('txtKMs').value = element['kms'];
                document.getElementById('txtPotencia').value = element['potencia'];
              
            }
    
        });
       
    }

    function limpiarFormulario() {
        const frm = document.forms[0];
        frm.reset();
    }

    function cancelar(){

        limpiarFormulario();
        document.getElementById('btnModificar').style.display = 'none';
        document.getElementById('btnEliminar').style.display = 'none';
        document.getElementById('btnCancelar').style.display = 'none';
      }

      window.addEventListener('load',inicializaManejadores);

    function inicializaManejadores(){

    
        actualizarLista();
        frm = document.forms[0];
        btnAlta.addEventListener('click',altaAnuncio);
    
        
    }

    function actualizarLista(){
    
        while(div.hasChildNodes()){
            div.removeChild(div.firstChild);
        }
        const gif = document.createElement('img');
        gif.setAttribute('src',"./img/rueda.gif");
        gif.classList.add('gif');

        div.appendChild(gif);


        setTimeout(() => {
            while(div.hasChildNodes()){
                div.removeChild(div.firstChild);
            }
            
            traerAnuncios();
        }, 3000);
    
    }

const crearItems = (data)=>{
    //guardo los anuncios en nuevo vec 
    listaAnuncios = [...data];
    const fragmento = document.createDocumentFragment();
    
    data.forEach(element => {
       
        const tr = document.createElement('tr');
      
        for(const key in element){
            const td = document.createElement('td');
            const texto = document.createTextNode(element[key]);
            //filtros--------------------------------------------------

            td.appendChild(texto);
            tr.appendChild(td);
        }
       
        if( element.hasOwnProperty('id')){
               
            tr.setAttribute('id',element['id']);
            
        }   
         mostrarBotones(tr);
     
        
        fragmento.appendChild(tr);
    });
    
    
    return fragmento;
}

function traerAnuncios(){
    
    tbody.innerHTML=""; 
    

    fetch('http://localhost:3000/anuncios')
    .then(res =>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
        
    })
    .then(data=>{
      
      
        const selectElement = document.querySelector('#txtTransaccion2');

        selectElement.addEventListener('change', (event) => {
            
            tbody.innerHTML="";
             const ventas = data.filter(trans =>trans.transaccion === event.target.value);

             
            
             if( event.target.value == "Todos"){
                
                tbody.appendChild(crearItems(data));
                tabla.appendChild(tbody);
                div.appendChild(tabla);

                let totalPromedio = data.reduce((previo,actual)=>{
                  
                   return {puertas:parseInt(previo.puertas) + parseInt(actual.puertas)};
               });

                document.getElementById('promedio').value = parseFloat(totalPromedio.puertas/data.length);
             }else{

                tbody.appendChild(crearItems(ventas));
                tabla.appendChild(tbody);
                div.appendChild(tabla);
                
                let totalPromedio = ventas.reduce((previo,actual)=>{
                   
                    return {puertas:parseInt(previo.puertas) + parseInt(actual.puertas)};
               });

                document.getElementById('promedio').value = parseFloat(totalPromedio.puertas/ventas.length);///ventas.length);
           
             }
            
             
        });
     
        tbody.appendChild(crearItems(data));
            tabla.appendChild(tbody);
            div.appendChild(tabla);

       
       
        console.log("autos obtenidos con exito");
    })
    .catch(err=>{
        console.error(err.status);
    })
    .finally(()=>{
        
       
    })
}



function altaAnuncio(){
    

    let nuevoAnuncio = {
    "id": "",
    "titulo":document.getElementById('txtTitulo').value,
    "transaccion":frm.transaccion.value,
    "descripcion":document.getElementById('txtDescripcion').value,
    "precio":document.getElementById('txtPrecio').value,
    "puertas":document.getElementById('txtPuertas').value,
    "kms":document.getElementById('txtKMs').value,
    "potencia":document.getElementById('txtPotencia').value
    };

    

    const config ={
        method:"POST",
        headers:{
            "Content-type":"application/json;charset=utf-8"
        },
        body:JSON.stringify(nuevoAnuncio)
    }
    
    fetch('http://localhost:3000/anuncios',config)
    .then(res =>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
        
    })
    .then(autoAgregado=>{
      
        console.log("Alata exitosa!",autoAgregado);
     
        actualizarLista();
    })
    .catch(err=>{
        console.error(err.status);
    })
    .finally(()=>{
        limpiarFormulario();
        
    })

}


function modificarAnuncio(){
    
    const id =idModificar;
    let a = {
        "id": "",
        "titulo":document.getElementById('txtTitulo').value,
        "transaccion":frm.transaccion.value,
        "descripcion":document.getElementById('txtDescripcion').value,
        "precio":document.getElementById('txtPrecio').value,
        "puertas":document.getElementById('txtPuertas').value,
        "kms":document.getElementById('txtKMs').value,
        "potencia":document.getElementById('txtPotencia').value
        };


    const config ={
        method:"PUT",
        headers:{
            "Content-type":"application/json;charset=utf-8"
        },
        body:JSON.stringify(a)
    }
    
    fetch('http://localhost:3000/anuncios/' + id,config)
    .then(res =>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
        
    })
    .then(anuncio=>{
      
        console.log("Modificación exitosa!",anuncio);

        actualizarLista();
    })
    .catch(err=>{
        console.error(err.status);
    })
    .finally(()=>{
    })

}

function bajaAnuncio(){
    
    const id =idModificar;

    const config ={
        method:"DELETE",
        headers:{
            "Content-type":"application/json;charset=utf-8"
        }
        
    }
    
    fetch('http://localhost:3000/anuncios/' + id,config)
    .then(res =>{
        if(!res.ok) return Promise.reject(res);
        return res.json();
        
    })
    .then(anuncio=>{
      
        console.log("Baja exitosa!",anuncio);
        actualizarLista();
    })
    .catch(err=>{
        console.error(err.status);
    })
    .finally(()=>{

    
    })

}












