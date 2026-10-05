// =========================================================================
// GESTIÓN DE BIENVENIDA Y SALUDO DINÁMICO
// =========================================================================

// Único evento de carga principal al iniciar la página
document.addEventListener("DOMContentLoaded", function() {
    const nombreGuardado = localStorage.getItem("nombrePacienteLanco");
    const modalBienv = document.getElementById("modalBienvenida");
    
    if (nombreGuardado) {
        // Si ya guardó su nombre antes, ocultamos el modal y saludamos con su nombre
        if (modalBienv) modalBienv.style.display = 'none';
        actualizarTextoSaludo(nombreGuardado);

        // Actualizamos también el saludo inicial del chat con el nombre guardado
        const primerMensajeChat = document.querySelector('#chatMessages p');
        if (primerMensajeChat) {
            primerMensajeChat.innerHTML = `¡Hola, <strong>${nombreGuardado}</strong>! Mucho gusto. Mi nombre es <strong>Kümen</strong>, el asistente virtual del <strong>Hospital Familiar y Comunitario de Lanco</strong>. ¿En qué puedo orientarte hoy sobre nuestros servicios, horarios o dudas de salud?`;
        }
    } else {
        // Si es su primera vez, mostramos el modal para que ingrese su nombre
        if (modalBienv) modalBienv.style.display = 'flex';
    }

    // 2. Banco de avisos comunitarios
    const listaAvisos = [
        "📅 <strong>Agendamiento (Día 1):</strong> El primer día hábil de cada mes está destinado exclusivamente al agendamiento de controles para <strong>pacientes crónicos</strong>.",
        "🦷 <strong>Agendamiento (Día 2):</strong> El segundo día hábil de cada mes está reservado exclusivamente para la asignación de horas <strong>odontológicas / dentales</strong>.",
        "🩺 <strong>Agendamiento (Día 3 en adelante):</strong> Desde el tercer día hábil y todo el resto del mes, puedes agendar para matrona, pediatría, enfermería, psicología y kinesiología.",
        "📞 <strong>Línea Gratuita 800 360 035:</strong> Operativa de lunes a viernes. Horario exclusivo para pedir horas médico general: lunes y miércoles de 8:30 a 10:00 hrs.",
        "⚖ <strong>Ley MILA:</strong> Tienes derecho a acompañamiento permanente y sin restricciones si eres niño, niña, adolescente o persona gestante hospitalizada.",
        "📝 <strong>Actualiza tus datos:</strong> Si cambiaste de teléfono o dirección, avísanos en OIRS o SOME. ¡Es vital para ubicarte a tiempo para tus controles!",
        "🩺 <strong>Servicio de Urgencia:</strong> Recuerda que la atención se rige estrictamente por gravedad clínica (Triage C1 a C5) y no por orden de llegada.",
        "💊 <strong>Farmacia y Apoyo:</strong> Recuerda portar tu cédula de identidad y receta al día al retirar fármacos. Los medicamentos particulares no se administran."
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

    // Configuración del Chatbot e Input de Entérate / Enter
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
    calcularFechasAgendas();
    verificarClimaYSalud();
});

// Función al hacer clic en "Ingresar al Portal"
function guardarNombreUsuario() {
    const input = document.getElementById("nombreUsuarioInput");
    const nombre = input.value.trim();
    
    if (nombre === "") {
        alert("Por favor, ingresa tu nombre para continuar.");
        return;
    }
    
    // Guardamos en la memoria del navegador
    localStorage.setItem("nombrePacienteLanco", nombre);
    
    // Ocultamos el modal de bienvenida
    const modalBienv = document.getElementById("modalBienvenida");
    if (modalBienv) modalBienv.style.display = 'none';
    
    // Actualizamos el saludo en pantalla de inmediato
    actualizarTextoSaludo(nombre);

    // Actualizamos el mensaje de bienvenida dentro del chat al vuelo
    const primerMensajeChat = document.querySelector('#chatMessages p');
    if (primerMensajeChat) {
        primerMensajeChat.innerHTML = `¡Hola, <strong>${nombre}</strong>! Mucho gusto. Mi nombre es <strong>Kümen</strong>, el asistente virtual del <strong>Hospital Familiar y Comunitario de Lanco</strong>. ¿En qué puedo orientarte hoy sobre nuestros servicios, horarios o dudas de salud?`;
    }
}

// Función auxiliar para obtener el nombre del usuario guardado
function obtenerNombreUsuario() {
    return localStorage.getItem("nombrePacienteLanco") || "vecino/a";
}

// Función centralizada para calcular la hora y pintar el saludo dinámico personalizado
function actualizarTextoSaludo(nombre) {
    const contenedorSaludo = document.getElementById("saludoDinamico");
    if (contenedorSaludo) {
        const hora = new Date().getHours();
        let saludoTiempo = "Qué bueno verte por aquí";
        
        if (hora >= 6 && hora < 12) {
            saludoTiempo = "¡Buenos días";
        } else if (hora >= 12 && hora < 20) {
            saludoTiempo = "¡Buenas tardes";
        } else {
            saludoTiempo = "¡Buenas noches";
        }
        
        if (nombre) {
            contenedorSaludo.textContent = `${saludoTiempo}, ${nombre}! 👋`;
        } else {
            contenedorSaludo.textContent = `${saludoTiempo}, vecino/a! 👋`;
        }
    }
}

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

// Funciones de Accesibilidad Universal conectadas a tu CSS
const fontLevels = ['text-sm-global', 'text-md-global', 'text-lg-global', 'text-xl-global'];
let currentFontIndex = 1;

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

// Compartir tarjeta oficial como imagen
async function compartirTarjetaOficial() {
    const tarjeta = document.getElementById('tarjetaCompartible');
    if (!tarjeta) return;

    try {
        if (typeof html2canvas === 'undefined') {
            alert("La librería html2canvas no está cargada correctamente.");
            return;
        }

        const canvas = await html2canvas(tarjeta, { scale: 2, useCORS: true, allowTaint: false });

        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const archivo = new File([blob], "horarios-hospital-lanco.png", { type: "image/png" });
            
            if (navigator.canShare && navigator.canShare({ files: [archivo] })) {
                try {
                    await navigator.share({
                        title: 'Horarios Oficiales - Hospital de Lanco',
                        text: 'Comparto la información oficial de horarios del Hospital de Lanco:',
                        files: [archivo],
                    });
                } catch (error) {
                    if (error.name !== 'AbortError') descargarImagenRespaldo(blob);
                }
            } else {
                descargarImagenRespaldo(blob);
            }
        }, 'image/png');

    } catch (error) {
        console.error("Error crítico al generar la imagen:", error);
    }
}

function descargarImagenRespaldo(blob) {
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = 'horarios-oficiales-hospital-lanco.png';
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);
}

function mostrarNivelTriage(nivel) {
    document.querySelectorAll('.triage-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.triage-btn').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-red-400', 'ring-orange-400', 'ring-amber-400', 'ring-blue-400', 'ring-slate-400', 'scale-105');
        btn.style.opacity = '0.7';
    });

    document.getElementById(`content-${nivel}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`btn-${nivel}`);
    activeBtn.style.opacity = '1';
    activeBtn.classList.add('scale-105');
    
    if(nivel === 'c1') activeBtn.classList.add('ring-2', 'ring-red-400');
    if(nivel === 'c2') activeBtn.classList.add('ring-2', 'ring-orange-400');
    if(nivel === 'c3') activeBtn.classList.add('ring-2', 'ring-amber-400');
    if(nivel === 'c4') activeBtn.classList.add('ring-2', 'ring-blue-400');
    if(nivel === 'c5') activeBtn.classList.add('ring-2', 'ring-slate-400');
}

function cambiarSectorAps(sector) {
    document.querySelectorAll('.aps-sector-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.aps-tab-btn').forEach(btn => {
        btn.classList.remove('border-teal-500', 'bg-teal-50', 'text-teal-800', 'border-2');
        btn.classList.add('border-slate-200', 'bg-slate-50', 'text-slate-600');
    });

    document.getElementById(`content-aps-${sector}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`btn-aps-${sector}`);
    activeBtn.classList.remove('border-slate-200', 'bg-slate-50', 'text-slate-600');
    activeBtn.classList.add('border-teal-500', 'bg-teal-50', 'text-teal-800', 'border-2');
}

function cambiarTabHospitalizacion(tab) {
    document.querySelectorAll('.hosp-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.hosp-tab-btn').forEach(btn => {
        btn.classList.remove('border-indigo-500', 'bg-indigo-50', 'text-indigo-800', 'border-2');
        btn.classList.add('border-slate-200', 'bg-slate-50', 'text-slate-600');
    });

    document.getElementById(`content-hosp-${tab}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`btn-hosp-${tab}`);
    activeBtn.classList.remove('border-slate-200', 'bg-slate-50', 'text-slate-600');
    activeBtn.classList.add('border-indigo-500', 'bg-indigo-50', 'text-indigo-800', 'border-2');
}

function cambiarTabTransversal(tab) {
    document.querySelectorAll('.trans-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.trans-tab-btn').forEach(btn => {
        btn.classList.remove('border-yellow-500', 'bg-yellow-50', 'text-yellow-900', 'border-2');
        btn.classList.add('border-slate-200', 'bg-slate-50', 'text-slate-600');
    });

    document.getElementById(`content-trans-${tab}`).classList.remove('hidden');
    const activeBtn = document.getElementById(`btn-trans-${tab}`);
    activeBtn.classList.remove('border-slate-200', 'bg-slate-50', 'text-slate-600');
    activeBtn.classList.add('border-yellow-500', 'bg-yellow-50', 'text-yellow-900', 'border-2');
}

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
        if (modalId === 'modalHorarios') {
            actualizarEstadosHorarios();
        }
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

function toggleSolicitanteFields(val) {
    const fields = document.getElementById('solicitanteFields');
    if (!fields) return;
    if (val === 'si') {
        fields.classList.remove('hidden');
    } else {
        fields.classList.add('hidden');
    }
}

function cambiarVista(nombreVista) {
    const idLimpio = nombreVista.replace('vista-', '');
    document.querySelectorAll('.vista-contenido').forEach(el => {
        el.classList.add('hidden');
    });
    const vistaDestino = document.getElementById('vista-' + idLimpio);
    if(vistaDestino) {
        vistaDestino.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }
}

// =========================================================================
// CONFIGURACIÓN Y CEREBRO DEL CHATBOT KÜMEN (INTELIGENTE Y SINCRONIZADO)
// =========================================================================

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

    // 1. Mostrar el mensaje del usuario
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

    // 2. Mostrar "Kümen está pensando..."
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = "flex items-start gap-2 max-w-[88%] opacity-70";
    botMsgDiv.innerHTML = `
        <div class="w-7 h-7 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
            <img src="logo_hfcl.png" alt="Logo" class="w-full h-full object-contain">
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
        let respuestaFallback = "Comprendo lo que nos comentas. Para entregarte la información más certera, te sugiero comunicarte con nuestra OIRS llamando al <a href='tel:800360035' class='text-hospital-700 font-bold underline'>800 360 035</a>. ¡Estamos para ayudarte!";
        let incluirDisclaimer = false; 
        let abrirModalHorarios = false; 
        
        const textoUsuario = texto.toLowerCase();
        const nombreActual = obtenerNombreUsuario();

        // Herramientas de reloj y feriados
        const ahora = new Date();
        const diaSemana = ahora.getDay();
        const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
        const mesDiaActual = String(ahora.getMonth() + 1).padStart(2, '0') + '-' + String(ahora.getDate()).padStart(2, '0');
        const feriadosChile = ['01-01', '05-01', '05-21', '06-21', '06-29', '07-16', '08-15', '09-18', '09-19', '10-12', '10-31', '11-01', '12-08', '12-25'];
        const esFeriado = feriadosChile.includes(mesDiaActual);

        function chequearHorario(bloques, diasPermitidos) {
            if (esFeriado) return "🔴 <strong>CERRADO (Feriado)</strong>";
            if (!diasPermitidos.includes(diaSemana)) return "🔴 <strong>CERRADO en este momento</strong>";
            for (let b of bloques) {
                const [hI, mI] = b.inicio.split(':').map(Number);
                const [hF, mF] = b.fin.split(':').map(Number);
                const inicio = hI * 60 + mI;
                const fin = hF * 60 + mF;
                if (minutosActuales >= inicio && minutosActuales <= fin) return "🟢 <strong>ABIERTO en este momento</strong>";
            }
            return "🔴 <strong>CERRADO en este momento</strong>";
        }

        // Mapa conceptual semántico para entender sinónimos del paciente
       const mapaConceptos = [
            {
                palabras: ['farmacia', 'remedio', 'pastilla', 'receta', 'medicamento'],
                nombre: 'Farmacia',
                horarioTexto: 'Lunes a Jueves de 08:00 a 17:00 hrs, y Viernes hasta las 16:00 hrs.',
                bloquesL_J: [{inicio:'08:00', fin:'17:00'}],
                bloquesV: [{inicio:'08:00', fin:'16:00'}],
                requiereModal: true
            },
            {
                palabras: ['vacuna', 'vacunatorio', 'influenza', 'covid', 'inocular', 'inyección', 'inyeccion'],
                nombre: 'Vacunatorio',
                horarioTexto: 'Lunes a Jueves hasta las 16:30 hrs y Viernes hasta las 15:30 hrs (cierra al mediodía entre 12:30 y 14:00 hrs).',
                bloquesL_J: [{inicio:'08:45', fin:'12:30'}, {inicio:'14:00', fin:'16:30'}],
                bloquesV: [{inicio:'08:45', fin:'12:30'}, {inicio:'14:00', fin:'15:30'}],
                requiereModal: true
            },
            {
                palabras: ['leche', 'pnac', 'alimento', 'harina', 'sobras'],
                nombre: 'Entrega de Leche (PNAC)',
                horarioTexto: 'Lunes a Jueves de 08:30 a 16:30 hrs, y los Viernes hasta las 15:30 hrs.',
                bloquesL_J: [{inicio:'08:30', fin:'16:30'}],
                bloquesV: [{inicio:'08:30', fin:'15:30'}],
                requiereModal: true
            },
            {
                palabras: ['oirs', 'reclamo', 'sugerencia', 'oficina', 'queja', 'felicitacion'],
                nombre: 'Oficina OIRS',
                horarioTexto: 'Lunes a Jueves (08:00 a 13:00 y de 14:00 a 17:00 hrs) y Viernes hasta las 16:00 hrs.',
                bloquesL_J: [{inicio:'08:00', fin:'13:00'}, {inicio:'14:00', fin:'17:00'}],
                bloquesV: [{inicio:'08:00', fin:'13:00'}, {inicio:'14:00', fin:'16:00'}],
                requiereModal: true
            },
            {
                palabras: ['imagen', 'imagenologia', 'imagenología', 'rayos', 'rx', 'radiografia', 'radiografía'],
                nombre: 'Unidad de Imagenología / Rayos',
                horarioTexto: 'Lunes a Jueves de 08:30 a 16:45 hrs, y los Viernes hasta las 15:45 hrs.',
                bloquesL_J: [{inicio:'08:30', fin:'16:45'}],
                bloquesV: [{inicio:'08:30', fin:'15:45'}],
                requiereModal: true
            },
            {
                palabras: ['kine', 'kinesiologia', 'kinesiología', 'kinesiologo', 'kinesiólogo', 'rehabilitacion', 'rehabilitación', 'terapia'],
                esKine: true
            },
            {
                palabras: ['urgencia', 'urgencias', 'sapu', 'emergencia', 'accidente', 'sangre', 'corte', 'dolor pecho', 'ahogo', 'golpe'],
                esUrgencia: true
            },
            {
                palabras: ['ubicacion', 'ubicación', 'donde', 'dónde', 'direccion', 'dirección', 'llegar', 'mapa', 'santiago'],
                esUbicacion: true
            },
            {
                palabras: ['hora', 'cita', 'medico', 'médico', 'pedir', 'general'],
                esHoraMedica: true
            },
            {
                palabras: ['tos', 'fiebre', 'resfrio', 'resfrío', 'garganta', 'gripe', 'malestar', 'respiratorio'],
                esSintoma: true
            },
            {
                palabras: ['some', 'ventanilla', 'mesón', 'mesongeneral'],
                nombre: 'SOME (Mesón de informaciones)',
                esTermino: true,
                significado: 'Es el mesón principal donde pides horas, confirmas tus citas y te registras al llegar al hospital.'
            },
            {
                palabras: ['morbilidad', 'enfermo', 'atencion general', 'atención general', 'doctor general'],
                nombre: 'Morbilidad',
                esTermino: true,
                significado: 'Es la consulta médica general para cuando te enfermas de forma imprevista (resfríos, dolores estomacales, etc.).'
            },
            {
                palabras: ['triage', 'categorizacion', 'categorización', 'gravedad'],
                nombre: 'Triage (Clasificación de Urgencia)',
                esTermino: true,
                significado: 'Evaluación rápida de la enfermera al llegar a urgencias para priorizar la atención según la gravedad clínica (C1 a C5), no por orden de llegada.'
            },
            {
                palabras: ['ges', 'auge', 'garantias'],
                nombre: 'GES / AUGE',
                esTermino: true,
                significado: 'Garantías Explícitas de Salud que aseguran por ley la atención, plazos y tratamientos para ciertas enfermedades.'
            }
        ];

let coincidenciaEncontrada = null;
        for (let concepto of mapaConceptos) {
            if (concepto.palabras.some(p => textoUsuario.includes(p))) {
                coincidenciaEncontrada = concepto;
                break;
            }
        }

        if (coincidenciaEncontrada) {
            let c = coincidenciaEncontrada;

            if (c.esUrgencia) {
                respuestaFallback = `⚠ <strong>Atención de Urgencia:</strong> ${nombreActual}, si tú o un familiar sufrieron un accidente grave o riesgo vital, acudan de inmediato a Urgencias en <strong>Santiago 595, Lanco</strong>.`;
                incluirDisclaimer = true;
            } 
            else if (c.esUbicacion) {
                respuestaFallback = `📍 ${nombreActual}, nos encontramos en <strong>Santiago 595, Lanco</strong>. <br><br><a href='https://maps.google.com/?q=Hospital+Familiar+y+Comunitario+de+Lanco' target='_blank' class='inline-block bg-hospital-700 text-white px-3 py-1.5 rounded-lg text-xs mt-2 font-medium hover:bg-hospital-800 transition'>Abrir ubicación en Google Maps 🗺️</a>`;
            }
            else if (c.esHoraMedica) {
                respuestaFallback = `📞 ${nombreActual}, las horas médicas generales se solicitan en la línea gratuita <a href='tel:800360035' class='text-hospital-700 font-bold underline'>800 360 035</a> los días Lunes y Miércoles de 08:30 a 10:00 hrs.<br><br><em>Te abriré los horarios oficiales para que los tengas a mano.</em>`;
                abrirModalHorarios = true;
            }
            else if (c.esKine) {
                respuestaFallback = `🏃‍♂️ <strong>Kinesiología y Rehabilitación:</strong> Las sesiones se coordinan mediante derivación directa de tu médico tratante en el policlínico.<br><br><em>💡 Para consultas sobre tus horas, acércate al sector de atención ambulatoria.</em>`;
            }
            else if (c.esSintoma) {
                respuestaFallback = `🌡 ${nombreActual}, si estás con tos, fiebre o síntomas respiratorios leves, te sugerimos abrigarte, mantener hidratación y solicitar evaluación en tu atención primaria. <br><br><strong>Ojo:</strong> Si la tos se acompaña de ahogo o dificultad grave para respirar, acude de inmediato a Urgencias.`;
                incluirDisclaimer = true;
            }
            else if (c.esTermino) {
                    respuestaFallback = `📖 <strong>¿Qué significa "${c.nombre}"?</strong><br><br>${c.significado}<br><br><em>¿Tienes alguna otra duda con los términos del hospital? ¡Pregúntame con confianza!</em>`;
            }
            else {
                let bloquesHoy = (diaSemana === 5) ? c.bloquesV : c.bloquesL_J;
                let diasValidos = (diaSemana === 5) ? [5] : [1, 2, 3, 4];
                let estadoActual = chequearHorario(bloquesHoy, diasValidos);

                respuestaFallback = `📋 <strong>${c.nombre}:</strong> Atendemos de ${c.horarioTexto}<br><br>👉 ${nombreActual}, según mi reloj, en este momento se encuentra ${estadoActual}.<br><br><em>¡Te abriré los horarios oficiales en pantalla!</em>`;
                abrirModalHorarios = c.requiereModal;
            }
        } 
        else if (textoUsuario.includes('hola') || textoUsuario.includes('buenos dias') || textoUsuario.includes('saludos')) {
            respuestaFallback = `¡Hola, <strong>${nombreActual}</strong>! Qué gusto saludarte. ¿En qué puedo orientarte hoy respecto a los servicios del hospital?`;
        }
        else if (textoUsuario.includes('nombre') || textoUsuario.includes('quién eres') || textoUsuario.includes('kumen')) {
            respuestaFallback = `¡Hola, <strong>${nombreActual}</strong>! Soy <strong>Kümen</strong>, el asistente virtual del Hospital Familiar y Comunitario de Lanco.`;
        }

        let htmlRespuesta = `<p class="text-sm leading-relaxed">${respuestaFallback}</p>`;
        if (incluirDisclaimer) {
            htmlRespuesta += `<div class='mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400 italic'>💡 Orientación preventiva. No reemplaza evaluación profesional.</div>`;
        }

        botMsgDiv.className = "flex items-start gap-2 max-w-[88%]";
        botMsgDiv.querySelector('div:nth-child(2)').innerHTML = htmlRespuesta;

        if (abrirModalHorarios) {
            setTimeout(() => {
                if(typeof openModal === 'function') openModal('modalHorarios');
            }, 2000); 
        }
    }

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

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
    { nombre: 'LOS ARRAYANES', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'ACCESO SUR', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'ALBERTO CORDOVA', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'AVENIDA CENTENARIO', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'BERNARDO O HIGGINS', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'CATRICO', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'COSTA AZUL', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'CORVI', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'CONDOR', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'COPIHUE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: '18 DE SEPTIEMBRE', sector: 'SUR', tipo: 'Urbano' },
    { nombre: 'LAGO PIRIHUEICO', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LAGO MAIHUE', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'C. MARTIN TORRES MONTOLLA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'MARTIN TORRES MONTOLLA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LAS CLAVELES', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LAS ROSAS', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS GIRASOLES', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS ALHELIES', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LOS ALERCES', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'LAGO PALLAIFA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'BLANCA SANHUEZA', sector: 'NORTE', tipo: 'Urbano' },
    { nombre: 'VICTOR JARA', sector: 'NORTE', tipo: 'Urbano' },
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
    { nombre: 'ROBERTO MATTA', sector: 'NORTE', tipo: 'Urbano' },
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
];

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

function buscarSector() {
    const input = removeAccents(document.getElementById('inputSector').value);
    const contenedor = document.getElementById('resultadoSector');
    
    if (input.length < 3) {
        contenedor.innerHTML = '<p class="text-xs text-slate-400 italic">Escribe al menos 3 letras para buscar...</p>';
        return;
    }

    const resultados = dataSectores.filter(item => removeAccents(item.nombre).includes(input));

    if (resultados.length === 0) {
        contenedor.innerHTML = '<div class="p-3 bg-slate-50 text-slate-500 rounded-xl text-xs text-center border border-slate-200">No encontramos ese lugar. Consulta directamente en el SOME Central.</div>';
        return;
    }

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

function calcularFechasAgendas() {
    const fechaActual = new Date();
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    let diasHabiles = [];
    let diaIterador = new Date(anio, mes, 1);
    
    while(diasHabiles.length < 3) {
        let diaSemana = diaIterador.getDay();
        if(diaSemana !== 0 && diaSemana !== 6) {
            diasHabiles.push(new Date(diaIterador));
        }
        diaIterador.setDate(diaIterador.getDate() + 1);
    }

    const formatearFecha = (fecha) => {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        let numDia = String(fecha.getDate()).padStart(2, '0');
        return `${dias[fecha.getDay()]} ${numDia} de ${meses[fecha.getMonth()]}`;
    };

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

document.addEventListener('DOMContentLoaded', calcularFechasAgendas);

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
                statusText.style.opacity = '0';
                setTimeout(() => {
                    statusText.innerText = steps[currentStep].text;
                    statusText.style.opacity = '1';
                }, 150);

                progressBar.style.width = steps[currentStep].progress;
                currentStep++;
            } else {
                clearInterval(interval);
                setTimeout(() => {
                    splash.style.opacity = '0';
                    setTimeout(() => {
                        splash.style.display = 'none';
                    }, 1000);
                }, 800);
            }
        }, 700);
    }
});

async function verificarClimaYSalud() {
    const cintillo = document.getElementById('cintilloSalud');
    const textoCintillo = document.getElementById('textoCintillo');
    const iconoCintillo = document.getElementById('iconoCintillo');

    if (!cintillo || !textoCintillo) return;

    try {
        const lat = -39.45;
        const lon = -72.53;
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m`);
        const data = await response.json();

        if (data && data.current) {
            const temp = data.current.temperature_2m;
            const precipitacion = data.current.precipitation;
            const viento = data.current.wind_speed_10m || 0;
            const weatherCode = data.current.weather_code;

            let mensaje = "";
            let iconoClass = "";
            let mostrarAlerta = false;

            if (temp <= 4) {
                mensaje = "⚠️ Alerta de Bajas Temperaturas en Lanco: El frío extremo favorece la circulación de virus respiratorios. Abrígate por capas, protege a niños y adultos mayores y evita cambios bruscos de temperatura.";
                iconoClass = "fa-snowflake";
                mostrarAlerta = true;
            } else if (temp >= 28) {
                mensaje = "⚠️ Aviso de Altas Temperaturas: Mantén una hidratación constante con agua, evita la exposición directa al sol en horas punta y protege a los grupos de riesgo frente a golpes de calor.";
                iconoClass = "fa-temperature-high";
                mostrarAlerta = true;
            } else if (precipitacion > 3.0 || [63, 65, 82].includes(weatherCode)) {
                mensaje = "⚠️ Condición de Precipitaciones Intensas: Ante las fuertes lluvias en la zona, extrema los cuidados en el hogar, evita zonas de acumulación de agua y mantén al día tus tratamientos médicos.";
                iconoClass = "fa-cloud-showers-heavy";
                mostrarAlerta = true;
            } else if (viento > 40) {
                mensaje = "⚠️ Alerta de Vientos Intensos en la Comuna: Se recomienda precaución al transitar y asegurar elementos exteriores para prevenir accidentes.";
                iconoClass = "fa-wind";
                mostrarAlerta = true;
            }

            if (mostrarAlerta) {
                textoCintillo.innerText = mensaje;
                iconoCintillo.className = `fa-solid ${iconoClass}`;
                cintillo.classList.remove('hidden');
            } else {
                cintillo.classList.add('hidden');
            }
        }
    } catch (error) {
        console.log("Sistema de clima en segundo plano inactivo:", error);
    }
}

document.addEventListener('DOMContentLoaded', verificarClimaYSalud);

function horaAMinutos(horaStr) {
    const [h, m] = horaStr.split(':').map(Number);
    return h * 60 + m;
}

function actualizarEstadosHorarios() {
    const ahora = new Date();
    const diaSemana = ahora.getDay(); 
    const minutosActuales = ahora.getHours() * 60 + ahora.getMinutes();
    const mesDiaActual = String(ahora.getMonth() + 1).padStart(2, '0') + '-' + String(ahora.getDate()).padStart(2, '0');

    const feriadosChile = [
        '01-01', '05-01', '05-21', '06-21', '06-29', '07-16', '08-15', 
        '09-18', '09-19', '10-12', '10-31', '11-01', '12-08', '12-25'
    ];

    const esFeriado = feriadosChile.includes(mesDiaActual);

    function crearBadge(estado) {
        if (estado === 'abierto') {
            return `<span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px] flex items-center gap-1 whitespace-nowrap shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> Abierto</span>`;
        } else if (estado === 'cierra-pronto') {
            return `<span class="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px] flex items-center gap-1 whitespace-nowrap shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Cierra pronto</span>`;
        } else if (estado === 'feriado') {
            return `<span class="px-2.5 py-1 bg-red-100 text-red-800 rounded-full font-bold text-[10px] flex items-center gap-1 whitespace-nowrap shadow-2xs"><i class="fa-solid fa-calendar-xmark"></i> Feriado (Cerrado)</span>`;
        } else {
            return `<span class="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-bold text-[10px] flex items-center gap-1 whitespace-nowrap shadow-2xs"><span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Cerrado</span>`;
        }
    }

    function evaluarBloques(bloques, diasPermitidos) {
        if (esFeriado) return 'feriado';
        if (!diasPermitidos.includes(diaSemana)) return 'cerrado';

        for (let b of bloques) {
            const inicio = horaAMinutos(b.inicio);
            const fin = horaAMinutos(b.fin);

            if (minutosActuales >= inicio && minutosActuales <= fin) {
                if (fin - minutosActuales <= 30) {
                    return 'cierra-pronto';
                }
                return 'abierto';
            }
        }
        return 'cerrado';
    }

    const elFarmacia = document.getElementById('estado-farmacia');
    if(elFarmacia) {
        elFarmacia.innerHTML = crearBadge(
            esFeriado ? 'feriado' : (diaSemana === 5 ? evaluarBloques([{ inicio: '08:00', fin: '16:00' }], [5]) : evaluarBloques([{ inicio: '08:00', fin: '17:00' }], [1, 2, 3, 4]))
        );
    }

    const elVac = document.getElementById('estado-vacunatorio');
    if(elVac) {
        elVac.innerHTML = crearBadge(
            esFeriado ? 'feriado' : (diaSemana === 5 ? evaluarBloques([{ inicio: '08:45', fin: '12:30' }, { inicio: '14:00', fin: '15:30' }], [5]) : evaluarBloques([{ inicio: '08:45', fin: '12:30' }, { inicio: '14:00', fin: '16:30' }], [1, 2, 3, 4]))
        );
    }

    const elLeche = document.getElementById('estado-leche');
    if(elLeche) {
        elLeche.innerHTML = crearBadge(
            esFeriado ? 'feriado' : (diaSemana === 5 ? evaluarBloques([{ inicio: '08:30', fin: '15:30' }], [5]) : evaluarBloques([{ inicio: '08:30', fin: '16:30' }], [1, 2, 3, 4]))
        );
    }

    const elOirs = document.getElementById('estado-oirs');
    if(elOirs) {
        elOirs.innerHTML = crearBadge(
            esFeriado ? 'feriado' : (diaSemana === 5 ? evaluarBloques([{ inicio: '08:00', fin: '13:00' }, { inicio: '14:00', fin: '16:00' }], [5]) : evaluarBloques([{ inicio: '08:00', fin: '13:00' }, { inicio: '14:00', fin: '17:00' }], [1, 2, 3, 4]))
        );
    }

    const elVisitas = document.getElementById('estado-visitas');
    if(elVisitas) {
        elVisitas.innerHTML = crearBadge(evaluarBloques([{ inicio: '11:30', fin: '17:30' }], [0, 1, 2, 3, 4, 5, 6]));
    }

    const elHoras = document.getElementById('estado-horas');
    if(elHoras) {
        elHoras.innerHTML = crearBadge(evaluarBloques([{ inicio: '08:30', fin: '10:00' }], [1, 3]));
    }
}