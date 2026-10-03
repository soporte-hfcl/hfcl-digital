document.addEventListener("DOMContentLoaded", function() {
    // 1. Saludo dinámico cálido según la hora
    const spanSaludo = document.getElementById('saludoDinamico');
    if (spanSaludo) {
        const hora = new Date().getHours();
        let saludo = "Qué bueno verte por aquí";
        if (hora >= 6 && hora < 12) {
            saludo = "¡Muy buenos días, vecino/a!";
        } else if (hora >= 12 && hora < 20) {
            saludo = "¡Muy buenas tardes!";
        } else {
            saludo = "¡Buenas noches!";
        }
        spanSaludo.textContent = saludo;
    }

    // 2. Banco de avisos comunitarios
    const listaAvisos = [
        "📞 <strong>Línea 800:</strong> Funciona de lunes a viernes, pero las horas se agendan solo lunes y miércoles de 8:30 a 10:00 hrs. El resto del horario opera como OIRS.",
        "📅 <strong>Calendario de Horas:</strong> El 1° día hábil del mes es exclusivo para pacientes crónicos; el 2° día para dentales; y el resto del mes para matrona, pediatría, enfermería, psicología, kinesiología y más.",
        "⚖️ <strong>Ley MILA:</strong> Tienes derecho a acompañamiento permanente y sin restricciones si eres niño, niña, adolescente o persona gestante hospitalizada.",
        "📝 <strong>Actualiza tus datos:</strong> Si cambiaste de número de teléfono o dirección, avísanos en OIRS para poder llamarte a tiempo a tus controles médicos.",
        "🩺 <strong>Urgencia:</strong> Recuerda que la atención en el servicio de urgencia se rige por gravedad clínica (Triage C1 a C5), no estrictamente por orden de llegada."
    ];

    // 3. Rotación automática cada 6 segundos con efecto de desvanecimiento
    const elAviso = document.getElementById('contenedorAviso');
    if (elAviso && listaAvisos.length > 0) {
        let indiceActual = 0;

        // Mostrar el primero de inmediato
        elAviso.innerHTML = listaAvisos[indiceActual];

        setInterval(() => {
            elAviso.classList.add('opacity-0');

            setTimeout(() => {
                indiceActual = (indiceActual + 1) % listaAvisos.length;
                elAviso.innerHTML = listaAvisos[indiceActual];
                elAviso.classList.remove('opacity-0');
            }, 500);

        }, 6000);
    }

    // 4. Configuración del Chatbot e Input de Entérate / Enter
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                procesarMensajeChat();
            }
        });
    }

    // Cargar sugerencias iniciales del chatbot
    filtrarPreguntas('todos');
});

// Menú Móvil
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const icon = document.getElementById('hamburgerIcon');
    menu.classList.toggle('hidden');
    if (menu.classList.contains('hidden')) {
        icon.className = "fa-solid fa-bars text-lg";
    } else {
        icon.className = "fa-solid fa-xmark text-lg";
    }
}

// Funciones de Accesibilidad Universal
const fontLevels = ['text-sm-global', 'text-md-global', 'text-lg-global', 'text-xl-global'];
let currentFontIndex = 1; // Empieza en md

function changeFontSize(direction) {
    const body = document.body;
    body.classList.remove(fontLevels[currentFontIndex]);
    currentFontIndex += direction;
    if (currentFontIndex < 0) currentFontIndex = 0;
    if (currentFontIndex >= fontLevels.length) currentFontIndex = fontLevels.length - 1;
    body.classList.add(fontLevels[currentFontIndex]);
}

function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}

function readPageAloud() {
    if (!('speechSynthesis' in window)) {
        alert("Tu navegador no soporta la lectura en voz alta.");
        return;
    }
    window.speechSynthesis.cancel();
    const textToRead = "Portal de Pacientes del Hospital Familiar y Comunitario de Lanco. Servicios disponibles: Urgencia, Atención Primaria, Entrega de Horas, Farmacia, Leche, OIRS y Formulario de Contacto.";
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'es-CL';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
}

/* =========================================================================
   COMPARTIR TARJETA OFICIAL COMO IMAGEN (BLINDADO)
   ========================================================================= */
async function compartirTarjetaOficial() {
    const tarjeta = document.getElementById('tarjetaCompartible');
    
    if (!tarjeta) {
        console.error("No se encontró el elemento #tarjetaCompartible");
        return;
    }

    try {
        // Asegurarnos de que html2canvas esté disponible
        if (typeof html2canvas === 'undefined') {
            alert("La librería html2canvas no está cargada correctamente.");
            return;
        }

        // Convertir el HTML en lienzo (Canvas)
        const canvas = await html2canvas(tarjeta, { 
            scale: 2,
            useCORS: true,
            allowTaint: false
        });

        canvas.toBlob(async (blob) => {
            if (!blob) {
                console.error("No se pudo crear el blob de la imagen.");
                return;
            }

            const archivo = new File([blob], "horarios-hospital-lanco.png", { type: "image/png" });
            
            // Verificar si el navegador soporta compartir archivos nativos (Celulares)
            if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
                try {
                    await navigator.share({
                        title: 'Horarios Oficiales - Hospital de Lanco',
                        text: 'Comparto la información oficial de horarios del Hospital de Lanco:',
                        files: [archivo],
                    });
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.log('Error al compartir, intentando descarga directa...', error);
                        descargarImagenRespaldo(blob);
                    }
                }
            } else {
                // Respaldo para PC o navegadores que no soportan compartir archivos
                descargarImagenRespaldo(blob);
            }
        }, 'image/png');

    } catch (error) {
        console.error("Error crítico al generar la imagen:", error);
        alert("Hubo un problema al generar la tarjeta. Asegúrate de abrir la página mediante un servidor local (Live Server).");
    }
}

// Función auxiliar de respaldo para descarga directa
function descargarImagenRespaldo(blob) {
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'horarios-oficiales-hospital-lanco.png';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

// Modales y Acordeones
function toggleFaq(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById('icon-' + id);
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus');
    } else {
        content.classList.add('hidden');
        icon.classList.remove('fa-minus');
        icon.classList.add('fa-plus');
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

window.onclick = function(event) {
    if (event.target.classList.contains('fixed') && event.target.classList.contains('backdrop-blur-sm')) {
        event.target.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Buscador instantáneo en tiempo real
const searchInput = document.getElementById('searchInput');
const cards = document.querySelectorAll('.searchable-card');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        cards.forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(term) ? 'flex' : 'none';
        });
    });
}

// Control de campos de solicitante (terceros) en OIRS
function toggleSolicitanteFields(val) {
    const fields = document.getElementById('solicitanteFields');
    if (!fields) return;
    if (val === 'si') {
        fields.classList.remove('hidden');
    } else {
        fields.classList.add('hidden');
    }
}

// Manejo del Formulario de Contacto General
function submitContactoForm(e) {
    e.preventDefault();
    const form = document.getElementById('contactoForm');
    const btn = document.getElementById('submitContactoBtn');
    const btnText = document.getElementById('btnContactoText');
    const btnIcon = document.getElementById('btnContactoIcon');
    const alertBox = document.getElementById('contactoSuccessAlert');

    btn.disabled = true;
    btnText.innerText = "Enviando mensaje...";
    btnIcon.className = "fa-solid fa-spinner fa-spin";

    setTimeout(() => {
        form.style.display = 'none';
        alertBox.classList.remove('hidden');
        form.reset();
        btn.disabled = false;
        btnText.innerText = "Enviar Mensaje";
        btnIcon.className = "fa-solid fa-paper-plane";
    }, 800);
}

function resetContactoForm() {
    const form = document.getElementById('contactoForm');
    const alertBox = document.getElementById('contactoSuccessAlert');
    form.style.display = 'block';
    alertBox.classList.add('hidden');
}

// Función para filtrar las preguntas frecuentes por categoría en modales
function filtrarFaq(categoria) {
    document.querySelectorAll('.faq-tab').forEach(tab => {
        tab.className = "faq-tab px-3 py-1.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 transition";
    });
    if(event && event.target) {
        event.target.className = "faq-tab px-3 py-1.5 rounded-xl font-medium bg-white text-hospital-700 shadow-sm transition";
    }

    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        if (categoria === 'todas' || item.getAttribute('data-categoria') === categoria) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// Conexión del formulario OIRS a Google Apps Script
const SCRIPT_URL = "https://script.google.com/macros/s/TU_URL_DE_APPS_SCRIPT_AQUI/exec";

function submitOirsForm(e) {
    e.preventDefault();
    const form = document.getElementById('oirsForm');
    const btn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnIcon = document.getElementById('btnIcon');
    const alertBox = document.getElementById('oirsSuccessAlert');

    btn.disabled = true;
    btnText.innerText = "Enviando al sistema OIRS...";
    btnIcon.className = "fa-solid fa-spinner fa-spin";

    const formData = new FormData(form);

    fetch(SCRIPT_URL, { method: 'POST', body: formData })
        .then(response => {
            form.style.display = 'none';
            alertBox.classList.remove('hidden');
            form.reset();
            btn.disabled = false;
            btnText.innerText = "Enviar Requerimiento Oficial";
            btnIcon.className = "fa-solid fa-paper-plane";
        })
        .catch(error => {
            form.style.display = 'none';
            alertBox.classList.remove('hidden');
            form.reset();
            btn.disabled = false;
            btnText.innerText = "Enviar Requerimiento Oficial";
            btnIcon.className = "fa-solid fa-paper-plane";
        });
}

function resetOirsForm() {
    const form = document.getElementById('oirsForm');
    const alertBox = document.getElementById('oirsSuccessAlert');
    form.style.display = 'block';
    alertBox.classList.add('hidden');
    const sf = document.getElementById('solicitanteFields');
    if(sf) sf.classList.add('hidden');
    const ts = document.getElementById('toggleSolicitante');
    if(ts) ts.value = 'no';
}

function cambiarVista(nombreVista) {
    // 1. Limpiamos el nombre por si acaso le pasas 'urgencia' o 'vista-urgencia'
    const idLimpio = nombreVista.replace('vista-', '');
    
    // 2. Ocultamos TODAS las vistas que tengan la clase .vista-contenido
    document.querySelectorAll('.vista-contenido').forEach(el => {
        el.classList.add('hidden');
    });
    
    // 3. Buscamos específicamente la vista de destino con el prefijo correcto
    const vistaDestino = document.getElementById('vista-' + idLimpio);
    
    if(vistaDestino) {
        // 4. Mostramos la vista destino
        vistaDestino.classList.remove('hidden');
        // 5. Subimos arriba del todo de manera instantánea
        window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
        console.error("No se encontró el contenedor: vista-" + idLimpio);
    }
}

// Configuración de la IA y el Chatbot Kümen
const CHAT_ENDPOINT = "/api/chat";

function toggleChatbot() {
    const chatWindow = document.getElementById('chatWindow');
    if(chatWindow) chatWindow.classList.toggle('hidden');
}

function enviarSugerencia(texto) {
    const chatInput = document.getElementById('chatInput');
    if(chatInput) {
        chatInput.value = texto;
        procesarMensajeChat();
    }
}

async function procesarMensajeChat() {
    const input = document.getElementById('chatInput');
    if(!input) return;
    const texto = input.value.trim();
    if (!texto) return;

    const chatMessages = document.getElementById('chatMessages');
    if(!chatMessages) return;

    // 1. Mostrar mensaje del usuario
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = "flex items-start gap-2 max-w-[85%] ml-auto justify-end";
    userMsgDiv.innerHTML = `
        <div class="bg-hospital-700 text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-slate-100 break-words">
            <p>${texto}</p>
        </div>
    `;
    chatMessages.appendChild(userMsgDiv);
    input.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // 2. Mensaje temporal de carga
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = "flex items-start gap-2 max-w-[88%] opacity-70";
    botMsgDiv.innerHTML = `
        <div class="w-7 h-7 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
            <img src="https://i.ibb.co/5gHpwbcX/logo-hl.png" alt="Logo" class="w-full h-full object-contain">
        </div>
        <div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-slate-700">
            <p class="italic text-slate-400">Kümen está pensando tu respuesta...</p>
        </div>
    `;
    chatMessages.appendChild(botMsgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const response = await fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensaje: texto })
        });

        if (!response.ok) throw new Error("Modo local activo");

        const data = await response.json();
        const respuestaIA = data.respuesta || "Comprendo tu consulta.";
        botMsgDiv.className = "flex items-start gap-2 max-w-[88%]";
        botMsgDiv.querySelector('div:nth-child(2)').innerHTML = `<p>${respuestaIA.replace(/\n/g, '<br>')}</p>`;
        
    } catch (error) {
        let respuestaFallback = "Comprendo lo que nos comentas. Para entregarte la información más certera y evitar confusiones, te sugiero comunicarte directamente con nuestra OIRS llamando al <a href='tel:800360035' class='text-hospital-700 font-bold underline'>800 360 035</a>. ¡Estamos para ayudarte!";
        let incluirDisclaimer = false; 
        const t = texto.toLowerCase();
        
        if (t.includes('nombre') || t.includes('quién eres') || t.includes('kumen')) {
            respuestaFallback = "¡Hola! Soy <strong>Kümen</strong>, el asistente virtual del Hospital Familiar y Comunitario de Lanco. Nací para acompañarte y orientarte de forma rápida en los servicios de nuestra comunidad.";
        } 
        else if (t.includes('hola') || t.includes('buenos dias') || t.includes('buenas tardes') || t.includes('saludos')) {
            respuestaFallback = "¡Hola! Qué gusto saludarte de parte de todo el equipo. ¿En qué puedo orientarte hoy respecto a los servicios de nuestro hospital?";
        }
        else if (t.includes('urgencia') || t.includes('emergencia') || t.includes('accident') || t.includes('sapu') || t.includes('dolor pecho') || t.includes('ahogo') || t.includes('respirar') || t.includes('golpe') || t.includes('cabeza') || t.includes('caida') || t.includes('caída') || t.includes('sangre') || t.includes('corte') || t.includes('herida') || t.includes('desmaya')) {
            respuestaFallback = "⚠️️ <strong>Atención de Urgencia 24/7:</strong> Si tú o un familiar sufrieron un accidente, golpe fuerte, síntoma crítico o riesgo vital, por favor no esperen: acudan de inmediato al servicio de urgencias en <strong>Santiago 595, Lanco</strong>.";
            incluirDisclaimer = true; 
        } 
        else if (t.includes('tos') || t.includes('resfrío') || t.includes('resfrio') || t.includes('garganta') || t.includes('fiebre') || t.includes('gripe') || t.includes('malestar')) {
            respuestaFallback = "🌡 Si estás con tos, fiebre o síntomas respiratorios leves, te sugerimos abrigarte, mantener hidratación y solicitar evaluación en tu atención primaria. <strong>Ojo:</strong> Si la tos se acompaña de ahogo o dificultad grave para respirar, acude de inmediato a Urgencia 24/7.";
            incluirDisclaimer = true; 
        }
        else if (t.includes('estomago') || t.includes('estómago') || t.includes('barriga') || t.includes('diarrea') || t.includes('vomito') || t.includes('vómito') || t.includes('nausea')) {
            respuestaFallback = "🤢 Ante molestias estomacales o digestivas, mantén una hidratación constante con agua o suero oral liviano. Si el dolor abdominal es muy intenso, persistente o hay vómitos con sangre, acude a Urgencia 24/7.";
            incluirDisclaimer = true;
        }
        else if (t.includes('farmacia') || t.includes('remedio') || t.includes('pastilla') || t.includes('receta')) {
            respuestaFallback = "💊 <strong>Farmacia:</strong> Atendemos de lunes a jueves de 08:00 a 17:00 hrs y viernes hasta las 16:00 hrs. Recuerda traer tu cédula de identidad y tu receta médica al día para agilizar el retiro.";
        } 
        else if (t.includes('leche') || t.includes('pnac') || t.includes('alimento') || t.includes('crecimiento')) {
            respuestaFallback = "🍼 <strong>Entrega de Leche y Alimentos (PNAC):</strong> Puedes venir a retirar los productos de lunes a jueves de 08:00 a 17:00 hrs y viernes hasta las 16:00 hrs. No olvides traer el carnet de control al día.";
        } 
        else if (t.includes('rayos') || t.includes('imagen') || t.includes('rx') || t.includes('radiografia')) {
            respuestaFallback = "🩻 La Unidad de Imagenología / Rayos atiende de lunes a jueves de 08:30 a 16:45 hrs y los viernes de 08:30 a 15:45 hrs.";
        } 
        else if (t.includes('laboratorio') || t.includes('examen') || t.includes('sangre') || t.includes('muestra')) {
            respuestaFallback = "🧪 La toma de muestras de laboratorio se realiza en las primeras horas de la mañana, según la indicación de tu médico y los cupos asignados en ventanilla.";
        } 
        else if (t.includes('vacuna') || t.includes('vacunatorio') || t.includes('influenza') || t.includes('covid')) {
            respuestaFallback = "💉 Nuestro vacunatorio funciona siguiendo las campañas vigentes del Ministerio de Salud. Te invitamos a consultar los horarios específicos del día directamente en nuestra recepción.";
        } 
        else if (t.includes('kine') || t.includes('rehabilitacion') || t.includes('rehabilitación')) {
            respuestaFallback = "🏃‍♂️ Las sesiones y tratamientos de Kinesiología se coordinan mediante derivación directa de tu médico tratante en el policlínico o controles crónicos.";
        } 
        else if (t.includes('dental') || t.includes('dentista') || t.includes('urgencia dental')) {
            respuestaFallback = "🦷 Las horas dentales se organizan según los cupos programados de cada ciclo. Si tienes una urgencia dental calificada, acérate a consultar con nuestro personal en el área.";
        } 
        else if (t.includes('cronico') || t.includes('crónicos') || t.includes('hipertension') || t.includes('diabetes')) {
            respuestaFallback = "📅 Los controles y seguimientos para pacientes crónicos se agendan de acuerdo con el calendario mensual de tu sector. <br><br><em>💡 <strong>Dato importante:</strong> Si cambiaste de número de teléfono o de domicilio recientemente, por favor avísanos para poder ubicarte a tiempo para tus llamados y controles.</em>";
        }
        else if (t.includes('hora') || t.includes('cita') || t.includes('medico') || t.includes('general') || t.includes('pedir')) {
            respuestaFallback = "📞 Para solicitar una hora con médico general, puedes llamarnos a nuestra línea gratuita <a href='tel:800360035' class='text-hospital-700 font-bold underline'>800 360 035</a> los días lunes y miércoles entre 08:30 y 10:00 hrs. <br><br><em>📱 <strong>Recuerda:</strong> Mantén tu número de contacto actualizado en el mesón o OIRS para que podamos ubicarte sin problemas si hay cambios en tu hora.</em>";
        }
        else if (t.includes('mila') || t.includes('acompañamiento')) {
            respuestaFallback = "💙 Porque nos importa tu bienestar emocional, la <strong>Ley MILA</strong> garantiza el derecho al acompañamiento permanente de Niñas, Niños, Adolescentes (NNA) y personas gestantes durante su hospitalización o atención.";
        } 
        else if (t.includes('ubicacion') || t.includes('donde') || t.includes('direccion') || t.includes('dirección') || t.includes('llegar')) {
            respuestaFallback = "📍 Nos encontramos en <strong>Santiago 595, Lanco</strong>, en la hermosa Región de Los Ríos. <br><br><a href='https://maps.google.com/?q=Hospital+Familiar+y+Comunitario+de+Lanco' target='_blank' class='inline-block bg-hospital-700 text-white px-3 py-1.5 rounded-lg text-xs mt-2 font-medium hover:bg-hospital-800 transition'>Abrir ubicación en Google Maps 🗺️</a>";
        } 
        else if (t.includes('oirs') || t.includes('reclamo') || t.includes('sugerencia') || t.includes('contacto')) {
            respuestaFallback = "ℹ️ ¿Tienes alguna duda institucional, sugerencia o reclamo? Nuestra Oficina de Informaciones, Reclamos y Sugerencias (OIRS) te atiende en el <a href='tel:800360035' class='text-hospital-700 font-bold underline'>800 360 035</a>. <br><br><em>🏠 Acércate también a la OIRS o SOME si necesitas actualizar tu dirección o número telefónico en nuestros registros.</em>";
        }

        let htmlRespuesta = `<p>${respuestaFallback}</p>`;
        if (incluirDisclaimer) {
            htmlRespuesta += `<div class='mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400 italic'>💡 Orientación preventiva institucional. No reemplaza una evaluación médica profesional.</div>`;
        }

        botMsgDiv.className = "flex items-start gap-2 max-w-[88%]";
        botMsgDiv.querySelector('div:nth-child(2)').innerHTML = htmlRespuesta;
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Banco completo de preguntas frecuentes categorizadas
const bancoPreguntasFrecuentes = [
    { categoria: 'urgencias', texto: '¿Cuándo ir a Urgencia?' },
    { categoria: 'urgencias', texto: 'Tengo tos o fiebre' },
    { categoria: 'horarios', texto: '¿A qué hora abre la Farmacia?' },
    { categoria: 'horarios', texto: '¿Cuándo se retira la leche (PNAC)?' },
    { categoria: 'horarios', texto: 'Horarios de Rayos X' },
    { categoria: 'tramites', texto: '¿Cómo pedir hora médica?' },
    { categoria: 'tramites', texto: '¿Dónde están ubicados?' },
    { categoria: 'tramites', texto: '¿Cómo contacto a la OIRS?' },
    { categoria: 'tramites', texto: '¿Qué es la Ley MILA?' }
];

// Función para renderizar las preguntas según el filtro seleccionado
function filtrarPreguntas(categoriaSeleccionada) {
    const contenedor = document.getElementById('containerSugerencias');
    if (!contenedor) return;

    const preguntasFiltradas = categoriaSeleccionada === 'todos' 
        ? [...bancoPreguntasFrecuentes].sort(() => 0.5 - Math.random()).slice(0, 3) 
        : bancoPreguntasFrecuentes.filter(p => p.categoria === categoriaSeleccionada);

    contenedor.innerHTML = preguntasFiltradas.map(item => `
        <button onclick="enviarSugerencia('${item.texto}')" 
            class="bg-slate-100 hover:bg-hospital-50 hover:text-hospital-700 text-slate-600 px-2.5 py-1 rounded-full whitespace-nowrap transition border border-slate-200 flex-shrink-0 text-xs">
            ${item.texto}
        </button>
    `).join('');
}

/* =========================================================================
   1. LÓGICA DEL CHECKLIST DINÁMICO (PREPARACIÓN DE VISITA)
   ========================================================================= */
function mostrarChecklist() {
    const seleccion = document.getElementById('selectTramite').value;
    const contenedor = document.getElementById('resultadoChecklist');
    
    if (!seleccion) {
        contenedor.classList.add('hidden');
        return;
    }

    let html = '';
    let clasesExtra = '';

    switch(seleccion) {
        case 'leche':
            clasesExtra = 'bg-sky-50 border-sky-200 text-sky-900';
            html = `
                <strong class="flex items-center gap-2 mb-2"><i class="fa-solid fa-baby text-sky-600"></i> Para retirar Leche (PNAC):</strong>
                <ul class="list-disc list-inside space-y-1 text-xs">
                    <li>Carnet de Control de Salud al día.</li>
                    <li>Vacunas al día correspondientes a la edad.</li>
                    <li>Cédula de Identidad de quien retira.</li>
                </ul>`;
            break;
        case 'anticonceptivo':
            clasesExtra = 'bg-pink-50 border-pink-200 text-pink-900';
            html = `
                <strong class="flex items-center gap-2 mb-2"><i class="fa-solid fa-clipboard-user text-pink-600"></i> Para Método Anticonceptivo:</strong>
                <ul class="list-disc list-inside space-y-1 text-xs">
                    <li><strong>Carnet de Control Ginecológico (Obligatorio).</strong></li>
                    <li>Cédula de Identidad.</li>
                    <li>Pasar a preparación antes de proceder.</li>
                </ul>`;
            break;
        case 'medicamentos':
            clasesExtra = 'bg-yellow-50 border-yellow-200 text-yellow-900';
            html = `
                <strong class="flex items-center gap-2 mb-2"><i class="fa-solid fa-pills text-yellow-600"></i> Para retirar Medicamentos:</strong>
                <ul class="list-disc list-inside space-y-1 text-xs">
                    <li>Receta médica vigente (Física o en sistema).</li>
                    <li>Cédula de Identidad.</li>
                    <li class="text-[10px] italic mt-2">Nota: No administramos ni entregamos medicamentos comprados de forma particular.</li>
                </ul>`;
            break;
        case 'urgencia':
            clasesExtra = 'bg-red-50 border-red-200 text-red-900';
            html = `
                <strong class="flex items-center gap-2 mb-2"><i class="fa-solid fa-truck-medical text-red-600"></i> Para Atención de Urgencia:</strong>
                <ul class="list-disc list-inside space-y-1 text-xs">
                    <li>Cédula de Identidad o Pasaporte.</li>
                    <li>Si es menor de edad, venir acompañado de un adulto responsable.</li>
                    <li class="font-bold mt-1">Recuerda: La atención es por gravedad (Triage), no por orden de llegada.</li>
                </ul>`;
            break;
    }

    contenedor.className = `mt-4 p-4 rounded-2xl border ${clasesExtra} block animate-fadeIn`;
    contenedor.innerHTML = html;
}

/* =========================================================================
   2. LÓGICA DEL BUSCADOR DE SECTORIZACIÓN (SOME NORTE Y SUR)
   ========================================================================= */
// Data extraída del documento de sectorización oficial
const dataSectores = [
    { nombre: 'AIDA HIDALGO', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'ASMUS STEIGMAIER', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'CIPRIANO CALDERARA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'CLAUDIO ARRAU', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'DESIDERIO CORBEAUX', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'EMILIO TIGGELBECK', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'FRANCISCO COLOANE', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'FLORENCIO PINEDA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'GERÓNIMO MONSALVE', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'HUEIMA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'HUMBERTO PARRA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'JOSE DE SAN MARTIN', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'JUAN ULLOA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'JUAN DE LA PIEDRA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LAS GARZAS', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS CANELOS', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS CISNES', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS LAURELES', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS LINGUES', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS MAÑIOS', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS OLIVILLOS', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS TINEOS', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS ULMOS', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LUIS AGUIRRE PINTO', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LUIS JARA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LUIS MELO', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LUMACO', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'MIGUEL PINEDA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'PABLO DE ROCA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'PASAJE ESTADIO', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'PEDRO SALVADORES', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'PUQUIÑE', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'PURULON', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'RAMON CARNICER', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'RIO CALLE CALLE', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'RIO CAUTIN', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'RIO CRUCES', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'RIO LEUFUCADE', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'RIO LINGUE', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'RIO SAN PEDRO', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'SANTIAGO (DESDE GERONIMO M.)', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'SIMON BOLIVAR', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'SOR IRMAGRD HETTICH', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'VICENTE HUIDOBRO', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'VIOLETA PARRA', sector: 'NORTE', tipo: 'Urbano' },
    
    { nombre: 'CATRICO', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'CUDICO', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'EL ARCO', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'EL MAITEN', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'EL TALLO', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'HUIPEL', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'IMULFUDI', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'LA ISLA', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'MUCUN', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'PILFITRANA', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'PUENTE NEGRO', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'SANTA MARIA', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'SANTA BERNARDITA', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'TRANA', sector: 'NORTE', tipo: 'Rural' },
    { nombre: 'TROLTROHUE', sector: 'NORTE', tipo: 'Rural' },

    { nombre: 'ACCESO SUR', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'ALBERTO CORDOVA', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'AVENIDA CENTENARIO', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'BERNARDO O HIGGINS', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'CATRICO', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'COSTA AZUL', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'CORVI', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'CONDOR', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'COPIHUE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'DIECIOCHO DE SEPTIEMBRE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'ESPERANZA', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'FRANCISCO PEÑA', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'FELIPE BARTHOU', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'GABRIELA MISTRAL', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'GRAN AVENIDA', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'GABRIEL VALLETTE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'LA RAMBLA', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'NUEVA NORTE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'PASAJE JOSE TOMAS GUTIERREZ', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'PASAJE FERROVIARIO', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'PASAJE ALHUES', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'PASAJE PINTO', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'PASAJE SAN LUIS', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'PANAMERICANA', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'PASAJE MANUEL RODRIGUEZ', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'PEDRO DE VALDIVIA', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'PORVENIR', sector: 'SUR', tipo: 'Urbano' },
    { nombre: '1 ORIENTE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: '2 ORIENTE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: '3 ORIENTE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: '4 ORIENTE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: '5 ORIENTE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: '22 DE MAYO', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'UNION', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'VALPARAISO', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'YUNGAY', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'CENTENARIO', sector: 'SUR', tipo: 'Urbano' },

    { nombre: 'NILCAHUIN', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'TRIPAYANTE', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'PURULON', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'HUEIMA', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'ESTACION PURULON', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'LILCOCO', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'SALTO DE AGUA', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'PUQUIÑE', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'LUMACO', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'LA PEÑA', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'AYLIN', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'CIRUELOS', sector: 'SUR', tipo: 'Rural' },
    { nombre: 'PON PON', sector: 'SUR', tipo: 'Rural' }
]; //[cite: 6]

// Función normalizadora (quita acentos para la búsqueda)
const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

function buscarSector() {
    const input = removeAccents(document.getElementById('inputSector').value);
    const contenedor = document.getElementById('resultadoSector');
    
    // Si escribe menos de 3 letras, limpiamos
    if (input.length < 3) {
        contenedor.innerHTML = '<p class="text-xs text-slate-400 italic">Escribe al menos 3 letras para buscar...</p>';
        return;
    }

    const resultados = dataSectores.filter(item => removeAccents(item.nombre).includes(input));

    if (resultados.length === 0) {
        contenedor.innerHTML = '<div class="p-3 bg-slate-50 text-slate-500 rounded-xl text-xs text-center border border-slate-200">No encontramos ese lugar. Consulta directamente en el SOME Central.</div>';
        return;
    }

    // Armamos las tarjetas de resultado
    let html = '';
    resultados.forEach(res => {
        const isNorte = res.sector === 'NORTE';
        const bgClass = isNorte ? 'bg-sky-50 border-sky-200' : 'bg-emerald-50 border-emerald-200';
        const textClass = isNorte ? 'text-sky-800' : 'text-emerald-800';
        const badgeClass = isNorte ? 'bg-sky-600' : 'bg-emerald-600';
        
        html += `
            <div class="p-3 rounded-xl border ${bgClass} flex items-center justify-between animate-fadeIn">
                <div>
                    <strong class="${textClass} text-sm block">${res.nombre}</strong>
                    <span class="text-[10px] uppercase text-slate-500 font-semibold">${res.tipo}</span>
                </div>
                <div class="${badgeClass} text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                    SOME ${res.sector}
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}


/* =========================================================================
   3. LÓGICA DEL HERBARIO VIRTUAL
   ========================================================================= */
const plantasHerbario = [
    { nombre: 'FOYE', comun: 'Canelo', color: 'bg-emerald-100 text-emerald-800' },
    { nombre: 'TRIWE', comun: 'Laurel', color: 'bg-green-100 text-green-800' },
    { nombre: 'PICHI', comun: 'Pichi romero', color: 'bg-lime-100 text-lime-800' },
    { nombre: 'AMPE', comun: 'Helechos', color: 'bg-teal-100 text-teal-800' },
    { nombre: 'MAFÜLN', comun: 'Salvia', color: 'bg-cyan-100 text-cyan-800' },
    { nombre: 'PEGÜ', comun: 'Peumo', color: 'bg-amber-100 text-amber-800' },
    { nombre: 'PAÑIL', comun: 'Matico', color: 'bg-yellow-100 text-yellow-800' },
    { nombre: 'KELON', comun: 'Maqui', color: 'bg-purple-100 text-purple-800' },
    { nombre: 'CHILCA', comun: 'Romero', color: 'bg-indigo-100 text-indigo-800' },
    { nombre: 'KOLEU', comun: 'Poleo', color: 'bg-blue-100 text-blue-800' },
    { nombre: 'VOQUI', comun: 'Copihue', color: 'bg-rose-100 text-rose-800' }
];

// Inyectar plantas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('gridHerbario');
    if(grid) {
        let html = '';
        plantasHerbario.forEach(planta => {
            html += `
                <div class="${planta.color} p-3 rounded-2xl flex flex-col items-center text-center justify-center border border-white/40 shadow-sm hover:scale-105 transition cursor-pointer" title="Medicina ancestral">
                    <span class="font-bold text-xs sm:text-sm block tracking-wide">${planta.nombre}</span>
                    <span class="text-[10px] opacity-80 mt-0.5">${planta.comun}</span>
                </div>
            `;
        });
        grid.innerHTML = html;
    }
});

/* =========================================================================
   CÁLCULO AUTOMÁTICO DE DÍAS HÁBILES PARA ENTREGA DE HORAS
   ========================================================================= */
function calcularFechasAgendas() {
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    // Array para guardar los primeros 3 días hábiles del mes actual
    let diasHabiles = [];
    // Empezamos desde el día 1 del mes
    let diaIterador = new Date(anio, mes, 1);
    
    while(diasHabiles.length < 3) {
        // getDay() devuelve 0 para Domingo y 6 para Sábado
        let diaSemana = diaIterador.getDay();
        if(diaSemana !== 0 && diaSemana !== 6) {
            diasHabiles.push(new Date(diaIterador));
        }
        diaIterador.setDate(diaIterador.getDate() + 1);
    }

    // Función para formatear (Ej: "Lunes 05 de Octubre")
    const formatearFecha = (fecha) => {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        let numDia = String(fecha.getDate()).padStart(2, '0');
        return `${dias[fecha.getDay()]} ${numDia} de ${meses[fecha.getMonth()]}`;
    };

    // Actualizar los textos en el HTML (Intenta actualizar ambas opciones)
    const opcionesIds = ['opt1', 'opt2'];
    opcionesIds.forEach(opt => {
        const d1 = document.getElementById(`fecha-dia1-${opt}`);
        const d2 = document.getElementById(`fecha-dia2-${opt}`);
        const d3 = document.getElementById(`fecha-dia3-${opt}`);
        
        if(d1) d1.innerText = formatearFecha(diasHabiles[0]);
        if(d2) d2.innerText = formatearFecha(diasHabiles[1]);
        if(d3) d3.innerText = formatearFecha(diasHabiles[2]);
    });
}

// Ejecutar la función apenas cargue la página
document.addEventListener('DOMContentLoaded', calcularFechasAgendas);

/* =========================================================================
   PANTALLA DE CARGA (SECUENCIA INSTITUCIONAL Y PAUSADA)
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('pantallaCarga');
    const progressBar = document.getElementById('splash-progress');
    const statusText = document.getElementById('splash-status');

    if (splash && progressBar && statusText) {
        const steps = [
            { progress: '25%', text: 'Cargando servicios de atención y urgencia...' },
            { progress: '50%', text: 'Organizando canales de orientación SOME...' },
            { progress: '75%', text: 'Integrando espacios de medicina intercultural...' },
            { progress: '100%', text: '¡Bienvenido a nuestro portal de salud!' }
        ];

        let currentStep = 0;

        const interval = setInterval(() => {
            if (currentStep < steps.length) {
                // Efecto de pequeño desvanecimiento al cambiar texto
                statusText.style.opacity = '0';
                setTimeout(() => {
                    statusText.innerText = steps[currentStep].text;
                    statusText.style.opacity = '1';
                }, 150);

                progressBar.style.width = steps[currentStep].progress;
                currentStep++;
            } else {
                clearInterval(interval);
                // Pausa final antes de desvanecer la pantalla
                setTimeout(() => {
                    splash.style.opacity = '0';
                    setTimeout(() => {
                        splash.style.display = 'none';
                    }, 1000); // 1 segundo de desvanecimiento suave
                }, 800);
            }
        }, 700); // Pausa de 0.7 segundos por cada fase (más lento y ceremonioso)
    }
});