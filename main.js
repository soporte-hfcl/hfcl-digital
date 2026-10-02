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

        function compartirHorarios() {
    const texto = "🏥 *HOSPITAL FAMILIAR Y COMUNITARIO DE LANCO*\n" +
                  "📍 *Dirección:* Santiago 595, Lanco\n\n" +
                  "🕒 *GUÍA DE HORARIOS OFICIALES*:\n\n" +
                  "🚨 *Servicio de Urgencia:* Atención 24/7 (Todos los días del año)\n\n" +
                  "💊 *Farmacia:* \n" +
                  "• Lunes a Jueves: 08:00 a 17:00 hrs\n" +
                  "• Viernes: 08:00 a 16:00 hrs\n\n" +
                  "🍼 *Entrega de Leche y Productos (PNAC):* \n" +
                  "• Lunes a Jueves: 08:30 a 16:30 hrs\n" +
                  "• Viernes: 08:30 a 15:30 hrs\n\n" +
                  "📞 *Oficina OIRS / Agendamiento Telefónico:* \n" +
                  "• Fono gratuito: 800 360 035\n" +
                  "• Lunes a Jueves (08:00 a 17:00 hrs) y Viernes (hasta las 16:00 hrs)\n\n" +
                  "🛏️ *Visitas a Hospitalizados:*\n" +
                  "• Lunes a Domingo: 11:30 a 17:30 hrs\n\n" +
                  "📱 _Comparte esta información oficial con tus familiares y vecinos de la comuna._";

    const urlWhatsApp = `https://api.whatsapp.com/send?text=${encodeURIComponent(texto)}`;
    window.open(urlWhatsApp, '_blank');
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
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto';
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

        // Función para filtrar las preguntas frecuentes por categoría
        function filtrarFaq(categoria) {
            // Actualizar estilos de las pestañas
            document.querySelectorAll('.faq-tab').forEach(tab => {
                tab.className = "faq-tab px-3 py-1.5 rounded-xl font-medium text-slate-600 hover:text-slate-900 transition";
            });
            event.target.className = "faq-tab px-3 py-1.5 rounded-xl font-medium bg-white text-hospital-700 shadow-sm transition";

            // Mostrar u ocultar las preguntas según la categoría
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
            document.getElementById('solicitanteFields').classList.add('hidden');
            document.getElementById('toggleSolicitante').value = 'no';
        }

        function cambiarVista(nombreVista) {
            document.querySelectorAll('.vista-contenido').forEach(el => el.classList.add('hidden'));
            document.getElementById('vista-' + nombreVista).classList.remove('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

// Configuración de la IA y el Chatbot Kümen (Modo Local Ampliado y Organizado)
        const CHAT_ENDPOINT = "/api/chat"; // Listo para el futuro backend

        function toggleChatbot() {
            const chatWindow = document.getElementById('chatWindow');
            chatWindow.classList.toggle('hidden');
        }

        function enviarSugerencia(texto) {
            document.getElementById('chatInput').value = texto;
            procesarMensajeChat();
        }

        // Eventos iniciales: Enter para enviar y carga de sugerencias
        document.addEventListener('DOMContentLoaded', () => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        procesarMensajeChat();
                    }
                });
            }
            cargarSugerenciasAleatorias();
        });

        async function procesarMensajeChat() {
            const input = document.getElementById('chatInput');
            const texto = input.value.trim();
            if (!texto) return;

            const chatMessages = document.getElementById('chatMessages');

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
                // Intento de conexión con backend seguro
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
                // Categorización Local Ampliada y Sello Institucional
                let respuestaFallback = "Comprendo lo que nos comentas. Para entregarte la información más certera y evitar confusiones, te sugiero comunicarte directamente con nuestra OIRS llamando al <a href='tel:800360035' class='text-hospital-700 font-bold underline'>800 360 035</a>. ¡Estamos para ayudarte!";
                let incluirDisclaimer = false; 
                const t = texto.toLowerCase();
                
                // CATEGORÍA 1: Presentación y Saludos
                if (t.includes('nombre') || t.includes('quién eres') || t.includes('kumen')) {
                    respuestaFallback = "¡Hola! Soy <strong>Kümen</strong>, el asistente virtual del Hospital Familiar y Comunitario de Lanco. Nací para acompañarte y orientarte de forma rápida en los servicios de nuestra comunidad.";
                } 
                else if (t.includes('hola') || t.includes('buenos dias') || t.includes('buenas tardes') || t.includes('saludos')) {
                    respuestaFallback = "¡Hola! Qué gusto saludarte de parte de todo el equipo. ¿En qué puedo orientarte hoy respecto a los servicios de nuestro hospital?";
                }

                // CATEGORÍA 2: Urgencias y Emergencias Vitales / Accidentes (Prioridad Alta)
                else if (t.includes('urgencia') || t.includes('emergencia') || t.includes('accident') || t.includes('sapu') || t.includes('dolor pecho') || t.includes('ahogo') || t.includes('respirar') || t.includes('golpe') || t.includes('cabeza') || t.includes('caida') || t.includes('caída') || t.includes('sangre') || t.includes('corte') || t.includes('herida') || t.includes('desmaya')) {
                    respuestaFallback = "⚠️ <strong>Atención de Urgencia 24/7:</strong> Si tú o un familiar sufrieron un accidente, golpe fuerte, síntoma crítico o riesgo vital, por favor no esperen: acudan de inmediato al servicio de urgencias en <strong>Santiago 595, Lanco</strong>.";
                    incluirDisclaimer = true; 
                } 

                // CATEGORÍA 3: Síntomas Comunes / Consulta Preventiva de Salud
                else if (t.includes('tos') || t.includes('resfrío') || t.includes('resfrio') || t.includes('garganta') || t.includes('fiebre') || t.includes('gripe') || t.includes('malestar')) {
                    respuestaFallback = "🌡️️ Si estás con tos, fiebre o síntomas respiratorios leves, te sugerimos abrigarte, mantener hidratación y solicitar evaluación en tu atención primaria. <strong>Ojo:</strong> Si la tos se acompaña de ahogo o dificultad grave para respirar, acude de inmediato a Urgencia 24/7.";
                    incluirDisclaimer = true; 
                }
                else if (t.includes('estomago') || t.includes('estómago') || t.includes('barriga') || t.includes('diarrea') || t.includes('vomito') || t.includes('vómito') || t.includes('nausea')) {
                    respuestaFallback = "🤢 Ante molestias estomacales o digestivas, mantén una hidratación constante con agua o suero oral liviano. Si el dolor abdominal es muy intenso, persistente o hay vómitos con sangre, acude a Urgencia 24/7.";
                    incluirDisclaimer = true;
                }

                // CATEGORÍA 4: Farmacia y Programas (PNAC / Leche)
                else if (t.includes('farmacia') || t.includes('remedio') || t.includes('pastilla') || t.includes('receta')) {
                    respuestaFallback = "💊 <strong>Farmacia:</strong> Atendemos de lunes a jueves de 08:00 a 17:00 hrs y viernes hasta las 16:00 hrs. Recuerda traer tu cédula de identidad y tu receta médica al día para agilizar el retiro.";
                } 
                else if (t.includes('leche') || t.includes('pnac') || t.includes('alimento') || t.includes('crecimiento')) {
                    respuestaFallback = "🍼 <strong>Entrega de Leche y Alimentos (PNAC):</strong> Puedes venir a retirar los productos de lunes a jueves de 08:00 a 17:00 hrs y viernes hasta las 16:00 hrs. No olvides traer el carnet de control al día.";
                } 

                // CATEGORÍA 5: Unidades de Apoyo y Diagnóstico (Rayos, Laboratorio, Vacunatorio)
                else if (t.includes('rayos') || t.includes('imagen') || t.includes('rx') || t.includes('radiografia')) {
                    respuestaFallback = "🩻 La Unidad de Imagenología / Rayos atiende de lunes a jueves de 08:30 a 16:45 hrs y los viernes de 08:30 a 15:45 hrs.";
                } 
                else if (t.includes('laboratorio') || t.includes('examen') || t.includes('sangre') || t.includes('muestra')) {
                    respuestaFallback = "🧪 La toma de muestras de laboratorio se realiza en las primeras horas de la mañana, según la indicación de tu médico y los cupos asignados en ventanilla.";
                } 
                else if (t.includes('vacuna') || t.includes('vacunatorio') || t.includes('influenza') || t.includes('covid')) {
                    respuestaFallback = "💉 Nuestro vacunatorio funciona siguiendo las campañas vigentes del Ministerio de Salud. Te invitamos a consultar los horarios específicos del día directamente en nuestra recepción.";
                } 

                // CATEGORÍA 6: Policlínicos, Kinesiología y Dental
                else if (t.includes('kine') || t.includes('rehabilitacion') || t.includes('rehabilitación')) {
                    respuestaFallback = "🏃‍♂️ Las sesiones y tratamientos de Kinesiología se coordinan mediante derivación directa de tu médico tratante en el policlínico o controles crónicos.";
                } 
                else if (t.includes('dental') || t.includes('dentista') || t.includes('urgencia dental')) {
                    respuestaFallback = "🦷 Las horas dentales se organizan según los cupos programados de cada ciclo. Si tienes una urgencia dental calificada, acérate a consultar con nuestro personal en el área.";
                } 
                else if (t.includes('cronico') || t.includes('crónicos') || t.includes('hipertension') || t.includes('diabetes')) {
                    respuestaFallback = "📅 Los controles y seguimientos para pacientes crónicos se agendan de acuerdo con el calendario mensual de tu sector. <br><br><em>💡 <strong>Dato importante:</strong> Si cambiaste de número de teléfono o de domicilio recientemente, por favor avísanos para poder ubicarte a tiempo para tus llamados y controles.</em>";
                }

                // CATEGORÍA 7: Gestión de Horas y Citas Médicas
                else if (t.includes('hora') || t.includes('cita') || t.includes('medico') || t.includes('general') || t.includes('pedir')) {
                    respuestaFallback = "📞 Para solicitar una hora con médico general, puedes llamarnos a nuestra línea gratuita <a href='tel:800360035' class='text-hospital-700 font-bold underline'>800 360 035</a> los días lunes y miércoles entre 08:30 y 10:00 hrs. <br><br><em>📱 <strong>Recuerda:</strong> Mantén tu número de contacto actualizado en el mesón o OIRS para que podamos ubicarte sin problemas si hay cambios en tu hora.</em>";
                }

                // CATEGORÍA 8: Derechos, Ubicación y OIRS
                else if (t.includes('mila') || t.includes('acompañamiento')) {
                    respuestaFallback = "💙 Porque nos importa tu bienestar emocional, la <strong>Ley MILA</strong> garantiza el derecho al acompañamiento permanente de Niñas, Niños, Adolescentes (NNA) y personas gestantes durante su hospitalización o atención.";
                } 
                else if (t.includes('ubicacion') || t.includes('donde') || t.includes('direccion') || t.includes('dirección') || t.includes('llegar')) {
                    respuestaFallback = "📍 Nos encontramos en <strong>Santiago 595, Lanco</strong>, en la hermosa Región de Los Ríos. <br><br><a href='https://maps.google.com/?q=Hospital+Familiar+y+Comunitario+de+Lanco' target='_blank' class='inline-block bg-hospital-700 text-white px-3 py-1.5 rounded-lg text-xs mt-2 font-medium hover:bg-hospital-800 transition'>Abrir ubicación en Google Maps 🗺️</a>";
                } 
                else if (t.includes('oirs') || t.includes('reclamo') || t.includes('sugerencia') || t.includes('contacto')) {
                    respuestaFallback = "ℹ️ ¿Tienes alguna duda institucional, sugerencia o reclamo? Nuestra Oficina de Informaciones, Reclamos y Sugerencias (OIRS) te atiende en el <a href='tel:800360035' class='text-hospital-700 font-bold underline'>800 360 035</a>. <br><br><em>🏠 Acércate también a la OIRS o SOMS si necesitas actualizar tu dirección o número telefónico en nuestros registros.</em>";
                }

                // Construcción final del mensaje del bot con o sin disclaimer médico
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

            // Filtrar las preguntas según la categoría (o mostrar todas si es 'todos')
            const preguntasFiltradas = categoriaSeleccionada === 'todos' 
                ? [...bancoPreguntasFrecuentes].sort(() => 0.5 - Math.random()).slice(0, 3) // Muestra 3 aleatorias si es 'todos'
                : bancoPreguntasFrecuentes.filter(p => p.categoria === categoriaSeleccionada);

            contenedor.innerHTML = preguntasFiltradas.map(item => `
                <button onclick="enviarSugerencia('${item.texto}')" 
                    class="bg-slate-100 hover:bg-hospital-50 hover:text-hospital-700 text-slate-600 px-2.5 py-1 rounded-full whitespace-nowrap transition border border-slate-200 flex-shrink-0 text-xs">
                    ${item.texto}
                </button>
            `).join('');
        }
        // Inicialización general al cargar la página
        document.addEventListener('DOMContentLoaded', () => {
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                chatInput.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        procesarMensajeChat();
                    }
                });
            }
            // Cargar las sugerencias aleatorias en el contenedor
            cargarSugerenciasAleatorias();
        });