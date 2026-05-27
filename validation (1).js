// validation.js
// Script de validación y lógica de interacción del formulario de aplicación HealthCore
// Lógica de mobile nav toggle y fallbackMostrar migrada desde index.html
document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mainMenuContainer = document.getElementById('main-menu-container');
  function closeMenuOnDesktop() {
    if (!mainMenuContainer || !menuToggle) return;
    if (window.innerWidth >= 768) {
      mainMenuContainer.classList.remove('hidden');
    } else {
      mainMenuContainer.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }
  if (menuToggle && mainMenuContainer) {
    menuToggle.addEventListener('click', function() {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !expanded);
      mainMenuContainer.classList.toggle('hidden');
    });
    window.addEventListener('resize', closeMenuOnDesktop);
    closeMenuOnDesktop();
  }

  // Fallback directo para mostrar listas si falla DOMContentLoaded
  function fallbackMostrar(btnId, listaId, imgId) {
    var btn = document.getElementById(btnId);
    var lista = document.getElementById(listaId);
    var img = document.getElementById(imgId);
    if (btn && lista && img) {
      btn.onclick = function() {
        lista.removeAttribute('hidden');
        lista.classList.remove('opacity-0', 'pointer-events-none');
        lista.classList.add('opacity-100');
        img.style.display = 'none';
        btn.style.display = 'none';
        lista.setAttribute('tabindex', '0');
        lista.focus();
      };
    }
  }
  fallbackMostrar('mostrar_inicio', 'inicio-lista', 'inicio-img');
  fallbackMostrar('mostrar_servicios', 'servicios-lista', 'servicios-img');
  fallbackMostrar('mostrar_equipo', 'equipo-lista', 'equipo-img');
  fallbackMostrar('mostrar_contacto', 'contacto-lista', 'contacto-img');
});
// Lógica para mostrar mensaje de éxito y redirigir tras envío (migrada desde index.html)
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form'); // Cambia el selector si tu formulario es más específico
  const successMsg = document.getElementById('success-message');
  const countdown = document.getElementById('countdown');
  const progressBar = document.getElementById('progress-bar');
  let timer = null;

  if (form && successMsg && countdown && progressBar) {
    form.addEventListener('submit', function (e) {
      // Si el formulario es válido, mostrar mensaje de éxito y redirigir
      if (form.checkValidity()) {
        e.preventDefault();
        successMsg.classList.remove('hidden');
        let seconds = 5;
        countdown.textContent = seconds;
        progressBar.style.width = '100%';
        timer = setInterval(() => {
          seconds--;
          countdown.textContent = seconds;
          progressBar.style.width = (seconds * 20) + '%';
          if (seconds <= 0) {
            clearInterval(timer);
            window.location.href = 'index.html#inicio';
          }
        }, 1000);
      }
    });
  }
});
// Valida todos los campos del formulario de aplicación HealthCore

document.addEventListener('DOMContentLoaded', function() {
      // Inicialización de eventos y lógica al cargar la página
    // Mostrar el apartado extra solo cuando el formulario esté extendido y disponibilidad tenga valor
    function mostrarApartadoExtra() {
        // Muestra u oculta el apartado extra según el estado del formulario
      const form = document.querySelector('form[aria-label="Formulario de aplicación a HealthCore"]');
      const disponibilidad = form ? form.querySelector('#disponibilidad') : null;
      const fieldsFinales = document.getElementById('fields-finales');
      const extra = document.getElementById('apartado-extra');
      // Solo mostrar si fields-finales es visible y disponibilidad tiene valor
      if (fieldsFinales && fieldsFinales.offsetParent !== null && disponibilidad && disponibilidad.value) {
        extra.style.display = 'flex';
      } else {
        extra.style.display = 'none';
      }
    }

    // Escuchar cambios en todos los campos relevantes
    [
      '#nombre', '#email', '#telefono', '#pais', '#sede', '#area', '#perfil', '#experiencia', '#disponibilidad'
    ].forEach(function(selector) {
        // Añade listeners a cada campo relevante para mostrar el apartado extra dinámicamente
      const campo = document.querySelector(selector);
      if (campo) {
        campo.addEventListener('input', mostrarApartadoExtra);
        campo.addEventListener('change', mostrarApartadoExtra);
      }
    });
    // Inicializar estado al cargar
    mostrarApartadoExtra();
  const form = document.querySelector('form[aria-label="Formulario de aplicación a HealthCore"]');
  if (!form) return;


  // Mostrar error específico debajo de cada campo
  function setFieldError(input, msg) {
      // Muestra el mensaje de error específico junto al campo correspondiente
    if (!input || input.offsetParent === null) return; // No mostrar error si el campo está oculto
    let err = input.parentNode.querySelector('.field-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'field-error';
      // Posicionamiento absoluto lateral izquierdo
      err.style.position = 'absolute';
      err.style.left = '-260px';
      err.style.top = '50%';
      err.style.transform = 'translateY(-50%)';
      err.style.whiteSpace = 'nowrap';
      err.style.zIndex = '20';
      // Estilos visuales llamativos
      err.style.background = '#fff0f0';
      err.style.border = '2px solid #e53935';
      err.style.color = '#b71c1c';
      err.style.fontWeight = 'bold';
      err.style.fontSize = '0.95rem';
      err.style.padding = '6px 14px';
      err.style.borderRadius = '8px';
      err.style.boxShadow = '0 2px 8px 0 #e5393533';
      err.style.pointerEvents = 'none';
      // El padre debe ser relative para posicionar bien
      input.parentNode.style.position = 'relative';
      input.parentNode.appendChild(err);
    }
    err.textContent = msg || '';
    err.style.display = msg ? 'block' : 'none';
  }

  function clearAllFieldErrors() {
      // Limpia todos los mensajes de error de los campos
    form.querySelectorAll('.field-error').forEach(e => { e.textContent = ''; e.style.display = 'none'; });
  }

  // Función de validación general
  function validarCampos(e, mostrarError = true) {
      // Función principal de validación de todos los campos del formulario
    let valid = true;
    clearAllFieldErrors();
    let errorMsg = '';

    // Referencia al botón de envío
    const btnSubmit = form.querySelector('button[type="submit"]');

    // Nombre: solo letras y espacios
    const nombre = form.querySelector('#nombre');
    if (nombre && nombre.offsetParent !== null && !nombre.value.trim().match(/^[A-Za-zÁÉÍÓÚáéíóúÑñüÜ\s]+$/)) {
      valid = false;
      errorMsg = 'El nombre solo puede contener letras y espacios.';
      if (mostrarError) nombre.focus();
      setFieldError(nombre, errorMsg);
    }

    // Email: formato válido
    const email = form.querySelector('#email');
    if (valid && email && email.offsetParent !== null && !email.value.trim().match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      valid = false;
      errorMsg = 'Introduce un correo electrónico válido.';
      if (mostrarError) email.focus();
      setFieldError(email, errorMsg);
    }

    // Teléfono: solo números, mínimo 9 dígitos
    const telefono = form.querySelector('#telefono');
    if (valid && telefono && telefono.offsetParent !== null && telefono.value && !telefono.value.trim().match(/^\d{9,15}$/)) {
      valid = false;
      errorMsg = 'El teléfono debe tener solo números y mínimo 9 dígitos.';
      if (mostrarError) telefono.focus();
      setFieldError(telefono, errorMsg);
    }

    // Prefijo país: obligatorio si hay teléfono
    const prefijo = form.querySelector('#telefono-prefijo');
    if (valid && telefono && telefono.offsetParent !== null && telefono.value && prefijo && prefijo.offsetParent !== null && !prefijo.value) {
      valid = false;
      errorMsg = 'Selecciona un prefijo de país.';
      if (mostrarError) prefijo.focus();
      setFieldError(prefijo, errorMsg);
    }

    // País de residencia: obligatorio si visible
    const pais = form.querySelector('#pais');
    if (valid && pais && pais.offsetParent !== null && !pais.value) {
      valid = false;
      errorMsg = 'Selecciona un país de residencia.';
      if (mostrarError) pais.focus();
      setFieldError(pais, errorMsg);
    }

    // Sede: obligatorio si visible
    const sede = form.querySelector('#sede');
    if (valid && sede && sede.offsetParent !== null && !sede.value) {
      valid = false;
      errorMsg = 'Selecciona una sede.';
      if (mostrarError) sede.focus();
      setFieldError(sede, errorMsg);
    }

    // Área de interés: obligatorio si visible
    const area = form.querySelector('#area');
    if (valid && area && area.offsetParent !== null && !area.value) {
      valid = false;
      errorMsg = 'Selecciona un área de interés.';
      if (mostrarError) area.focus();
      setFieldError(area, errorMsg);
    }

    // Perfil profesional: obligatorio si visible
    const perfil = form.querySelector('#perfil');
    if (valid && perfil && perfil.offsetParent !== null && !perfil.value) {
      valid = false;
      errorMsg = 'Selecciona un perfil profesional.';
      if (mostrarError) perfil.focus();
      setFieldError(perfil, errorMsg);
    }

    // Experiencia: obligatorio si visible
    const experiencia = form.querySelector('#experiencia');
    if (valid && experiencia && experiencia.offsetParent !== null && !experiencia.value.trim()) {
      valid = false;
      errorMsg = 'Describe tu experiencia previa.';
      if (mostrarError) experiencia.focus();
      setFieldError(experiencia, errorMsg);
    }

    // Disponibilidad: obligatorio si visible
    const disponibilidad = form.querySelector('#disponibilidad');
    if (valid && disponibilidad && disponibilidad.offsetParent !== null && !disponibilidad.value) {
      valid = false;
      errorMsg = 'Selecciona tu disponibilidad.';
      if (mostrarError) disponibilidad.focus();
      setFieldError(disponibilidad, errorMsg);
    }

    // Si hay error, mostrar mensaje y evitar envío
    const errorDiv = document.getElementById('form-error');
    if (!valid) {
      if (btnSubmit) btnSubmit.disabled = true;
      if (mostrarError) {
        if (errorDiv) {
          errorDiv.textContent = errorMsg;
          errorDiv.classList.remove('hidden');
        } else {
          alert(errorMsg);
        }
        if (e) e.preventDefault();
      }
      return false;
    } else {
      if (btnSubmit) btnSubmit.disabled = false;
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.add('hidden');
      }
    }
    return true;
  }


  // Validación en tiempo real SOLO en campos visibles
  const campos = [
    '#nombre', '#email', '#telefono', '#telefono-prefijo', '#pais', '#sede', '#area', '#perfil', '#experiencia', '#disponibilidad'
  ];
  campos.forEach(function(selector) {
    const campo = form.querySelector(selector);
    if (campo) {
      campo.addEventListener('input', function() {
        if (campo.offsetParent !== null) validarCampos(null, true);
      });
      campo.addEventListener('blur', function() {
        if (campo.offsetParent !== null) validarCampos(null, true);
      });
    }
  });

  // Bloquear el botón de envío si hay errores
  validarCampos(null, false);

  // Si el usuario intenta enviar con el botón deshabilitado, mostrar mensaje
  const btnSubmit = form.querySelector('button[type="submit"]');
  if (btnSubmit) {
    btnSubmit.addEventListener('click', function(e) {
      if (btnSubmit.disabled) {
        e.preventDefault();
        const errorDiv = document.getElementById('form-error');
        if (errorDiv) {
          errorDiv.textContent = 'Por favor, completa correctamente el formulario antes de enviarlo.';
          errorDiv.classList.remove('hidden');
        } else {
          alert('Por favor, completa correctamente el formulario antes de enviarlo.');
        }
      }
    });
  }

  // Validación al enviar
  form.addEventListener('submit', function(e) {
    validarCampos(e, true);
  });
});
        if(window.innerWidth < 900) menu.classList.remove('active');

// Modal functions
// Funciones para abrir y cerrar modales informativos
function openModal(tipo) {
  const modal = document.getElementById('modal');
  const bg = document.getElementById('modal-bg');
  let title = '', content = '';
  if(tipo==='cita') { title='Pedir cita'; content='<input type="text" placeholder="Nombre" required><br><input type="tel" placeholder="Teléfono" required><br><button type="submit">Solicitar</button>'; }
  if(tipo==='info') { title='Solicitar información'; content='<input type="email" placeholder="Tu email" required><br><textarea placeholder="¿En qué podemos ayudarte?" required></textarea><br><button type="submit">Enviar</button>'; }
  if(tipo==='chequeo') { title='Chequeos y Prevención'; content='Incluye analíticas, revisiones y seguimiento médico personalizado.'; }
  if(tipo==='materno') { title='Atención Materno Infantil'; content='Acompañamiento integral en embarazo, parto y pediatría.'; }
  if(tipo==='especialistas') { title='Especialistas y Citas Rápidas'; content='Acceso a más de 30 especialidades médicas.'; }
  if(tipo==='resultados') { title='Descargar resultados'; content='Accede a tus analíticas y pruebas de imagen desde tu área privada.'; }
  if(tipo==='cuadro') { title='Cuadro médico'; content='Consulta nuestro directorio de profesionales y especialidades.'; }
  document.getElementById('modal-title').innerText = title;
  document.getElementById('modal-content').innerHTML = content;
  modal.style.display = 'block';
  bg.style.display = 'block';
}
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-bg').style.display = 'none';
}
