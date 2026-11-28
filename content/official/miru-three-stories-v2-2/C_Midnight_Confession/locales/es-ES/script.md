# CHAPTER 1｜Confesión a medianoche
⟦GOAL|Lucian entrega el rosario de tu madre. ¿Qué haces primero?|Confesión a medianoche⟧
⟦DONE|flag|c_c01_event|Observar el cambio clave|Narración: En la pared hay una niña pintada de espaldas. Su bufanda es idéntica a la de tu infancia.⟧
⟦DONE|say|Lucian entrega el rosario de tu madre. ¿Qué haces primero? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Entrada del confesionario cerrado
⟦BG|bg_c_c01s01|Entrada del confesionario cerrado — La campana da doce golpes. Con una foto anterior a la desaparición de tu madre, abres la puerta de madera. En el suelo quedan marcas de agua recién limpiada.⟧
⟦TIME|00:00⟧
Narración: La primera noche. Entrada del confesionario cerrado.
Narración: La campana da doce golpes. Con una foto anterior a la desaparición de tu madre, abres la puerta de madera. En el suelo quedan marcas de agua recién limpiada.
Lucian: “¿Vienes a buscar a una desaparecida o a alguien que confiese por ella?”
Lucian: “¿Quieres decirme tu nombre o prefieres que explique por qué ha vuelto a abrirse esta sala?”
⟦FREE⟧
Narración: Tras la celosía se mueve una silla. Una llave golpea suavemente la mesa.
Narración: Mientras se apaga el tintineo de la llave tras la celosía, ¿quieres buscar el sobre 💌 entre los iconos? Puedes saltarlo.
⟦MG|g_find_letter⟧

# SCENE｜Celosía del confesionario
⟦BG|bg_c_c01s02|Celosía del confesionario — A través de la vieja celosía, Lucian describe el abrigo azul que llevaba tu madre hace siete años, incluso el botón arrancado. Solo ves sus manos, con los nudillos blancos de apretar. Desliza una lámpara hacia ti: por primera vez puedes elegir tu propia luz en la oscuridad.⟧
⟦TIME|00:25⟧
Narración: Poco después. Celosía del confesionario.
Narración: A través de la vieja celosía, Lucian describe el abrigo azul que llevaba tu madre hace siete años, incluso el botón arrancado. Solo ves sus manos, con los nudillos blancos de apretar. Desliza una lámpara hacia ti: por primera vez puedes elegir tu propia luz en la oscuridad.
Lucian: “Aquel día me preguntó si alguien la esperaba fuera.”
Lucian: “¿Me preguntarás adónde fue o qué le respondí entonces?”
⟦FREE⟧
Narración: La celosía se abre lentamente. Una antigua cadena dejó una tenue marca en su muñeca.
Narración: Con la lámpara delante, antes de examinar la celosía, ¿quieres girar cartas y emparejar recuerdos iguales? Puedes saltarlo.
⟦MG|g_mem_memory⟧

# SCENE｜Sala lateral de la capilla
⟦BG|bg_c_c01s03|Sala lateral de la capilla — Lucian deja el rosario y la llave del sótano en la mesa de piedra. Las pequeñas letras talladas por tu madre hacen imposible confundir el rosario.⟧
⟦TIME|00:50⟧
Narración: Poco después. Sala lateral de la capilla.
Narración: Lucian deja el rosario y la llave del sótano en la mesa de piedra. Las pequeñas letras talladas por tu madre hacen imposible confundir el rosario.
Lucian: “Fui el último que le abrió la puerta. No es motivo de orgullo.”
Lucian: “¿Quieres bajar ahora o que primero escriba los hechos que puedo demostrar esta noche?”
⟦FREE⟧
Narración: En la pared hay una niña pintada de espaldas. Su bufanda es idéntica a la de tu infancia.
⟦SET|c_c01_event⟧

# CHOICE｜Lucian entrega el rosario de tu madre. ¿Qué haces primero?
#### A｜Exigir su versión sobre la puerta cerrada
Narración: Entrega el registro de aquella noche; los recuerdos vagos no bastan.
⟦OPT|A|set:c_c01_a⟧
#### B｜Guardar el rosario y verificar su origen
Narración: El rosario entra en una bolsa de pruebas, con procedencia rastreable para el siguiente paso.
⟦OPT|B|set:c_c01_b⟧
#### C｜Rechazar su compañía y contactar con una investigadora
Narración: Nora recibe el lugar y la información de la llave; la investigación no depende de Lucian.
⟦OPT|C|set:c_c01_c⟧
# ·
Narración: ¿Quién vigila ahora la puerta cerrada desde fuera hace siete años?

# CHAPTER 2｜Ecos bajo la abadía
⟦GOAL|Aparece tu retrato infantil tras la puerta oculta. ¿Qué haces?|Ecos bajo la abadía⟧
⟦DONE|flag|c_c02_event|Observar el cambio clave|Narración: Tras la tabla hay un papel con siete fechas.⟧
⟦DONE|say|Aparece tu retrato infantil tras la puerta oculta. ¿Qué haces? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Pasillo del sótano
⟦BG|bg_c_c02s01|Pasillo del sótano — Bajas los antiguos escalones de piedra. Una de cada tres luces del pasillo está rota; varios nombres del registro de visitas están raspados.⟧
⟦TIME|01:00⟧
Narración: Más tarde esa noche. Pasillo del sótano.
⟦IF|c_c01_a⟧
Narración: Entrega el registro de aquella noche; los recuerdos vagos no bastan.
⟦/IF⟧
⟦IF|c_c01_b⟧
Narración: El rosario entra en una bolsa de pruebas, con procedencia rastreable para el siguiente paso.
⟦/IF⟧
⟦IF|c_c01_c⟧
Narración: Nora recibe el lugar y la información de la llave; la investigación no depende de Lucian.
⟦/IF⟧
Narración: Bajas los antiguos escalones de piedra. Una de cada tres luces del pasillo está rota; varios nombres del registro de visitas están raspados. Ahora toca cotejar los nombres raspados del registro.
Lucian: “Esas raspaduras aparecieron después de su desaparición.”
Lucian: “¿Quieres cotejar las fechas o abrir el último armario sellado?”
⟦FREE⟧
Narración: En el borde del registro descansa un justificante de recogida de medicamentos con sello del hospital.
Narración: Antes de cotejar las entradas del registro abierto, ¿quieres girar cartas y emparejar recuerdos iguales? Puedes saltarlo.
⟦MG|g_mem_memory⟧

# SCENE｜Archivo subterráneo
⟦BG|bg_c_c02s02|Archivo subterráneo — Lucian abre el armario antes controlado por Agnes. Contiene registros de medicación, recibos de efectivo y un sobre sellado que dice «aislamiento temporal». Sujeta un marco a punto de caer; sus nudillos se detienen junto a tu mano, sin cerrar la distancia.⟧
⟦TIME|01:25⟧
Narración: Poco después. Archivo subterráneo.
Narración: Lucian abre el armario antes controlado por Agnes. Contiene registros de medicación, recibos de efectivo y un sobre sellado que dice «aislamiento temporal». Sujeta un marco a punto de caer; sus nudillos se detienen junto a tu mano, sin cerrar la distancia.
Lucian: “Entonces solo me permitían acceder a un estante.”
Lucian: “¿Quieres que explique quién tenía llaves o que sellemos todo para Nora?”
⟦FREE⟧
Narración: En el alféizar hay una taza de té recién usada. Alguien ha venido esta noche al sótano.
Narración: Al separar los registros de medicación y los recibos, ¿quieres deslizar las fichas 📷 para ordenar 1–8? Puedes saltarlo.
⟦MG|g_slide_photo⟧

# SCENE｜Puerta oculta del sótano
⟦BG|bg_c_c02s03|Puerta oculta del sótano — Retiras el marco suelto y descubres una familia de tres pintada por tu madre. La bufanda roja del niño era tu regalo de noveno cumpleaños.⟧
⟦TIME|01:50⟧
Narración: Poco después. Puerta oculta del sótano.
Narración: Retiras el marco suelto y descubres una familia de tres pintada por tu madre. La bufanda roja del niño era tu regalo de noveno cumpleaños.
Lucian: “Nunca había visto este cuadro. Lo escondieron después de que me fuera.”
Lucian: “¿Quieres llevarte el cuadro o averiguar quién abrió recientemente la puerta oculta?”
⟦FREE⟧
Narración: Tras la tabla hay un papel con siete fechas.
⟦SET|c_c02_event⟧

# CHOICE｜Aparece tu retrato infantil tras la puerta oculta. ¿Qué haces?
#### A｜Conservar el retrato y comprobar la letra
Narración: Se conserva la media luna detrás del cuadro y la pista queda protegida.
⟦OPT|A|set:c_c02_a⟧
#### B｜Pedir a Lucian que documente lo que desconoce
Narración: Registra los límites de lo que sabe; no podrá fingir después que lo sabía todo.
⟦OPT|B|set:c_c02_b⟧
#### C｜Pedir a Nora que examine los accesos recientes
Narración: Se documentan el polvo de la cerradura y la taza reciente, dejando rastros de los visitantes.
⟦OPT|C|set:c_c02_c⟧
# ·
Narración: ¿Quién te incluyó entonces en el plan?

# CHAPTER 3｜Lluvia y antiguos votos
⟦GOAL|Lucian reconoce que le atraes. ¿Cómo respondes?|Lluvia y antiguos votos⟧
⟦DONE|flag|c_c03_event|Observar el cambio clave|Narración: La lluvia amaina. Nora avisa: aún existe una copia sin conexión de las grabaciones de vigilancia antiguas.⟧
⟦DONE|say|Lucian reconoce que le atraes. ¿Cómo respondes? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Biblioteca bajo la tormenta
⟦BG|bg_c_c03s01|Biblioteca bajo la tormenta — La lluvia hace vibrar las vidrieras. Lucian se quita la antigua insignia del cuello y la guarda en un cajón sin cerrar. Su cuello negro está mojado; la insignia brilla un instante entre las velas y desaparece.⟧
⟦TIME|22:00⟧
Narración: La segunda noche. Biblioteca bajo la tormenta.
⟦IF|c_c02_a⟧
Narración: Se conserva la media luna detrás del cuadro y la pista queda protegida.
⟦/IF⟧
⟦IF|c_c02_b⟧
Narración: Registra los límites de lo que sabe; no podrá fingir después que lo sabía todo.
⟦/IF⟧
⟦IF|c_c02_c⟧
Narración: Se documentan el polvo de la cerradura y la taza reciente, dejando rastros de los visitantes.
⟦/IF⟧
Narración: La lluvia hace vibrar las vidrieras. Lucian se quita la antigua insignia del cuello y la guarda en un cajón sin cerrar. Su cuello negro está mojado; la insignia brilla un instante entre las velas y desaparece.
Lucian: “Dejé el clero hace siete años. Pero sigo escondiéndome tras las normas, como aquel día.”
Lucian: “¿Quieres saber por qué me fui o buscar primero la carta que tu madre dejó en la estantería?”
⟦FREE⟧
Narración: Un libro desencuadernado deja ver el plano de la antigua sala de hospitalización.
Narración: Antes de apartar la vela para leer el plano que asoma del libro, ¿quieres deslizar las fichas 📷 para ordenar 1–8? Puedes saltarlo.
⟦MG|g_slide_photo⟧

# SCENE｜Mesa de lectura
⟦BG|bg_c_c03s02|Mesa de lectura — La mecha se acorta. Lucian se inclina para descifrar la tinta, con los dedos en el borde del papel, sin tocarte. Vuestras sombras están cerca, pero primero te acerca el plano de la sala.⟧
⟦TIME|22:25⟧
Narración: Poco después. Mesa de lectura.
Narración: La mecha se acorta. Lucian se inclina para descifrar la tinta, con los dedos en el borde del papel, sin tocarte. Vuestras sombras están cerca, pero primero te acerca el plano de la sala.
Lucian: “No soy alguien en quien puedas confiar sin más. Pero quiero aprender a decir toda la verdad.”
Lucian: “¿Leo la página más difícil del diario o prefieres contarme qué sospechas de mí?”
⟦FREE⟧
Narración: Truena fuera. Su primer gesto es proteger el viejo diario de Mara.
Narración: Mientras el diario queda a salvo de la ventana mojada, ¿quieres observar las cuatro luces y repetir su secuencia? Puedes saltarlo.
⟦MG|g_simon_lights⟧

# SCENE｜Ventana de vidriera
⟦BG|bg_c_c03s03|Ventana de vidriera — Encuentras un aviso antiguo: «alta prohibida». Lucian sostiene tu mirada sin aprovechar las velas para acercarse. Aparta los ojos de tus labios y los fija en el aviso.⟧
⟦TIME|22:50⟧
Narración: Poco después. Ventana de vidriera.
Narración: Encuentras un aviso antiguo: «alta prohibida». Lucian sostiene tu mirada sin aprovechar las velas para acercarse. Aparta los ojos de tus labios y los fija en el aviso.
Lucian: “Quiero besarte. No es el momento, y ese deseo no debe reducir mi culpa.”
Lucian: “¿Quieres que me calle o puedo quedarme y explicar ese aviso?”
⟦FREE⟧
Narración: La lluvia amaina. Nora avisa: aún existe una copia sin conexión de las grabaciones de vigilancia antiguas.
⟦SET|c_c03_event⟧

# CHOICE｜Lucian reconoce que le atraes. ¿Cómo respondes?
#### A｜Aceptar la atracción, pero exigir primero las pruebas
Narración: Lucian puede expresar sus sentimientos con sinceridad y entrega el plano al abogado.
⟦OPT|A|set:c_c03_a⟧
#### B｜Centrar la conversación en Mara
Narración: Deja de insinuarse y solo aporta hechos demostrables.
⟦OPT|B|set:c_c03_b⟧
#### C｜Preguntar si el deseo oculta su culpa
Narración: Admite que la intimidad no reduce la responsabilidad y deja de usar los sentimientos para eludir preguntas.
⟦OPT|C|set:c_c03_c⟧
# ·
Narración: ¿Por qué aparece en las imágenes del encierro de tu madre alguien que quiere acercarse a ti?

# CHAPTER 4｜Ella no se marchó por voluntad propia
⟦GOAL|La grabación prueba el encierro de tu madre. ¿A quién investigas primero?|Ella no se marchó por voluntad propia⟧
⟦DONE|flag|c_c04_event|Observar el cambio clave|Narración: El abogado abre el expediente: los registros médicos de entonces mencionan siete cartas nunca enviadas.⟧
⟦DONE|say|La grabación prueba el encierro de tu madre. ¿A quién investigas primero? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Archivo de vigilancia
⟦BG|bg_c_c04s01|Archivo de vigilancia — En la grabación de hace siete años, dos auxiliares llevan a Mara a una sala cerrada. Ella se gira buscando una salida. La fecha contradice el informe de supuesto ingreso voluntario.⟧
⟦TIME|11:00⟧
Narración: La mañana del tercer día. Archivo de vigilancia.
⟦IF|c_c03_a⟧
Narración: Lucian puede expresar sus sentimientos con sinceridad y entrega el plano al abogado.
⟦/IF⟧
⟦IF|c_c03_b⟧
Narración: Deja de insinuarse y solo aporta hechos demostrables.
⟦/IF⟧
⟦IF|c_c03_c⟧
Narración: Admite que la intimidad no reduce la responsabilidad y deja de usar los sentimientos para eludir preguntas.
⟦/IF⟧
Narración: En la grabación de hace siete años, dos auxiliares llevan a Mara a una sala cerrada. Ella se gira buscando una salida. La fecha contradice el informe de supuesto ingreso voluntario. Ahora toca cotejar aquellas imágenes de vigilancia fotograma a fotograma.
Nora: “No entró por voluntad propia. Este fragmento lo demuestra.”
Nora: “¿Quieres conservar el original o interrogar inmediatamente a quienes estaban de turno?”
⟦FREE⟧
Narración: En el borde de la imagen aparece Lucian con el registro de las cerraduras.
Narración: Antes de volver a ver el siguiente tramo de la grabación conservada, ¿quieres observar las cuatro luces y repetir su secuencia? Puedes saltarlo.
⟦MG|g_simon_lights⟧

# SCENE｜Antiguo pasillo médico
⟦BG|bg_c_c04s02|Antiguo pasillo médico — Lucian se detiene ante aquella puerta. Admite que sabía que estaba cerrada desde fuera y no intervino. Al verse grabado apenas levanta la cabeza, pero deja la llave a tu alcance.⟧
⟦TIME|11:25⟧
Narración: Poco después. Antiguo pasillo médico.
Narración: Lucian se detiene ante aquella puerta. Admite que sabía que estaba cerrada desde fuera y no intervino. Al verse grabado apenas levanta la cabeza, pero deja la llave a tu alcance.
Lucian: “La vi pedir ayuda. Me dije que la dirección tendría sus motivos.”
Lucian: “¿Quieres que lo repita ante la cámara o que entregue testimonio escrito al abogado?”
⟦FREE⟧
Narración: Mete su insignia de turno en una bolsa de pruebas. Tiene los ojos rojos, pero no pide perdón.
Narración: Al comprobar el registro de la bolsa que guarda la insignia, ¿quieres buscar el sobre 💌 entre los iconos? Puedes saltarlo.
⟦MG|g_find_letter⟧

# SCENE｜Sala de reuniones jurídicas
⟦BG|bg_c_c04s03|Sala de reuniones jurídicas — Nora entrega la grabación a un abogado independiente. Lucian escribe todo lo ocurrido mientras estuvo allí, sin borrar los detalles más vergonzosos.⟧
⟦TIME|11:50⟧
Narración: Poco después. Sala de reuniones jurídicas.
Narración: Nora entrega la grabación a un abogado independiente. Lucian escribe todo lo ocurrido mientras estuvo allí, sin borrar los detalles más vergonzosos.
Nora: “Necesitamos horas verificables, no una disculpa bonita.”
Nora: “¿Qué quieres seguir ahora: las órdenes médicas, el dinero o el paradero posterior de tu madre?”
⟦FREE⟧
Narración: El abogado abre el expediente: los registros médicos de entonces mencionan siete cartas nunca enviadas.
⟦SET|c_c04_event⟧

# CHOICE｜La grabación prueba el encierro de tu madre. ¿A quién investigas primero?
#### A｜Exigir que documente su presencia
Narración: Entrega al abogado una declaración escrita; el silencio se convierte en responsabilidad verificable.
⟦OPT|A|set:c_c04_a⟧
#### B｜Investigar quién cerró la puerta y autorizó la orden
Narración: Nora preserva los registros del personal y la sala; surgen nuevos testigos.
⟦OPT|B|set:c_c04_b⟧
#### C｜Suspender los encuentros privados con Lucian
Narración: Entrega documentos mediante la investigadora, sin buscar confianza a través de la cercanía privada.
⟦OPT|C|set:c_c04_c⟧
# ·
Narración: ¿Cuánto más oculta su silencio sobre tu madre?

# CHAPTER 5｜Siete cartas sin enviar
⟦GOAL|Han cambiado los sellos de las siete cartas. ¿Qué investigarás?|Siete cartas sin enviar⟧
⟦DONE|flag|c_c05_event|Observar el cambio clave|Narración: La media hoja solo contiene un nombre: Agnes.⟧
⟦DONE|say|Han cambiado los sellos de las siete cartas. ¿Qué investigarás? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Escalera del campanario
⟦BG|bg_c_c05s01|Escalera del campanario — Sopla mucho viento en el campanario. La linterna ilumina una caja metálica cubierta de polvo. Dentro hay siete cartas selladas que nadie envió.⟧
⟦TIME|21:00⟧
Narración: La tercera noche. Escalera del campanario.
⟦IF|c_c04_a⟧
Narración: Entrega al abogado una declaración escrita; el silencio se convierte en responsabilidad verificable.
⟦/IF⟧
⟦IF|c_c04_b⟧
Narración: Nora preserva los registros del personal y la sala; surgen nuevos testigos.
⟦/IF⟧
⟦IF|c_c04_c⟧
Narración: Entrega documentos mediante la investigadora, sin buscar confianza a través de la cercanía privada.
⟦/IF⟧
Narración: Sopla mucho viento en el campanario. La linterna ilumina una caja metálica cubierta de polvo. Dentro hay siete cartas selladas que nadie envió.
Lucian: “Escribía cada noche, pero nadie enviaba sus cartas.”
Lucian: “¿Quieres leer primero la más reciente o cotejarlas desde la primera?”
⟦FREE⟧
Narración: Todos los sellos llevan la misma marca singular de media luna.
Narración: Antes de colocar las siete cartas por fecha, ¿quieres buscar el sobre 💌 entre los iconos? Puedes saltarlo.
⟦MG|g_find_letter⟧

# SCENE｜Estante del campanario
⟦BG|bg_c_c05s02|Estante del campanario — La sexta carta incluye la dirección del abogado de tu abuela. Falta la mitad de la séptima. Lucian reconoce que el sello no es el habitual de tu abuela. Conoce los trazos alargados de tu madre; cuanto más sabe, más difícil resulta perdonar su silencio.⟧
⟦TIME|21:25⟧
Narración: Poco después. Estante del campanario.
Narración: La sexta carta incluye la dirección del abogado de tu abuela. Falta la mitad de la séptima. Lucian reconoce que el sello no es el habitual de tu abuela. Conoce los trazos alargados de tu madre; cuanto más sabe, más difícil resulta perdonar su silencio. Ahora toca comparar los distintos sellos de cera de las siete cartas.
Lucian: “Alguien recortó su voz hasta que decía lo que otros querían oír.”
Lucian: “¿Leo las palabras restantes o enviamos las cartas a un perito calígrafo?”
⟦FREE⟧
Narración: En el fondo de la caja aparece un anexo testamentario aún más antiguo.
Narración: Al guardar por separado el anexo del fondo de la caja, ¿quieres girar cartas y emparejar recuerdos iguales? Puedes saltarlo.
⟦MG|g_mem_memory⟧

# SCENE｜Ventana del campanario
⟦BG|bg_c_c05s03|Ventana del campanario — Al comparar las cartas descubres que añadieron después la estancia de siete noches; la firma imita claramente la letra de tu abuela.⟧
⟦TIME|21:50⟧
Narración: Poco después. Ventana del campanario.
Narración: Al comparar las cartas descubres que añadieron después la estancia de siete noches; la firma imita claramente la letra de tu abuela.
Nora: “Si es una falsificación, no necesitas seguir atrapada aquí ni un día.”
Nora: “¿Seguirás alojada para investigar o vendrás mañana desde la ciudad?”
⟦FREE⟧
Narración: La media hoja solo contiene un nombre: Agnes.
⟦SET|c_c05_event⟧

# CHOICE｜Han cambiado los sellos de las siete cartas. ¿Qué investigarás?
#### A｜Verificar el testamento original con el abogado
Narración: El despacho confirma indicios de documentos añadidos; la regla de siete noches empieza a tambalearse.
⟦OPT|A|set:c_c05_a⟧
#### B｜Reconstruir el orden de las cartas
Narración: La cronología demuestra que alguien interceptó sus peticiones de ayuda.
⟦OPT|B|set:c_c05_b⟧
#### C｜Preguntar a Agnes por la condición añadida
Narración: Agnes deja su primera explicación escrita y ya no podrá negarlo todo.
⟦OPT|C|set:c_c05_c⟧
# ·
Narración: ¿Quién diseñó tu cuenta atrás de siete noches?

# CHAPTER 6｜Los celos son más sinceros que una oración
⟦GOAL|Lucian envidia la confianza que recibe Nora. ¿Cómo respondes?|Los celos son más sinceros que una oración⟧
⟦DONE|flag|c_c06_event|Observar el cambio clave|Narración: Al fondo del pasillo, Agnes se detiene sin perder su sonrisa serena.⟧
⟦DONE|say|Lucian envidia la confianza que recibe Nora. ¿Cómo respondes? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Claustro de la abadía
⟦BG|bg_c_c06s01|Claustro de la abadía — Nora llega con una pista nueva. Se coloca cerca de ti para hablar de las pruebas. Lucian se detiene a medio paso, con el té.⟧
⟦TIME|15:00⟧
Narración: La tarde del cuarto día. Claustro de la abadía.
⟦IF|c_c05_a⟧
Narración: El despacho confirma indicios de documentos añadidos; la regla de siete noches empieza a tambalearse.
⟦/IF⟧
⟦IF|c_c05_b⟧
Narración: La cronología demuestra que alguien interceptó sus peticiones de ayuda.
⟦/IF⟧
⟦IF|c_c05_c⟧
Narración: Agnes deja su primera explicación escrita y ya no podrá negarlo todo.
⟦/IF⟧
Narración: Nora llega con una pista nueva. Se coloca cerca de ti para hablar de las pruebas. Lucian se detiene a medio paso, con el té.
Lucian: “Con ella puedes preguntar sin miedo. Eso es lo que envidio.”
Lucian: “¿Quieres que diga claramente qué temo o que deje el té y me vaya?”
⟦FREE⟧
Narración: Nora extiende sobre la barandilla de piedra una copia reescrita de un testimonio antiguo.

# SCENE｜Galería soleada del claustro
⟦BG|bg_c_c06s02|Galería soleada del claustro — Lucian descubre un trazo que tapa su nombre en ese testimonio. Mira la fecha sin tocarte la mano. Al ver la sonrisa con que Nora te permite bajar la guardia, admite por primera vez que envidia a alguien digno de confianza.⟧
⟦TIME|15:25⟧
Narración: Poco después. Galería soleada del claustro.
Narración: Lucian descubre un trazo que tapa su nombre en ese testimonio. Mira la fecha sin tocarte la mano. Al ver la sonrisa con que Nora te permite bajar la guardia, admite por primera vez que envidia a alguien digno de confianza.
Lucian: “Puede que entonces firmara algo que no debía.”
Lucian: “¿Busco ahora el original o escuchamos primero la opinión de Nora?”
⟦FREE⟧
Narración: Nora confirma que el papel es más reciente que hace siete años: quizá sea una transcripción posterior.

# SCENE｜Banco del patio
⟦BG|bg_c_c06s03|Banco del patio — Nora muestra una página desprendida del registro. Las fibras del borde coinciden con las de las cartas del campanario.⟧
⟦TIME|15:50⟧
Narración: Poco después. Banco del patio.
Narración: Nora muestra una página desprendida del registro. Las fibras del borde coinciden con las de las cartas del campanario.
Nora: “Alguien convirtió a tu madre en un secreto que había que guardar.”
Nora: “¿Quieres que vaya a ver a Agnes o que Lucian entregue primero la llave del almacén antiguo?”
⟦FREE⟧
Narración: Al fondo del pasillo, Agnes se detiene sin perder su sonrisa serena.
Narración: Mientras Nora coteja las fibras de la página desprendida, ¿quieres girar cartas y emparejar recuerdos iguales? Puedes saltarlo.
⟦MG|g_mem_memory⟧
Narración: Con la página junto a las cartas del campanario, antes de seguir anotando, ¿quieres deslizar las fichas 📷 para ordenar 1–8? Puedes saltarlo.
⟦MG|g_slide_photo⟧
⟦SET|c_c06_event⟧

# CHOICE｜Lucian envidia la confianza que recibe Nora. ¿Cómo respondes?
#### A｜Decir que la sinceridad es una condición de la cercanía
Narración: Admite firmar un registro antiguo y decide buscar el original por iniciativa propia.
⟦OPT|A|set:c_c06_a⟧
#### B｜Exigir que separe los celos del caso
Narración: Vuelve a ser testigo y no interfiere en tu colaboración con Nora.
⟦OPT|B|set:c_c06_b⟧
#### C｜Rechazar el contacto privado y trabajar con Nora
Narración: La investigación sigue; Lucian solo puede entregar material en los horarios acordados.
⟦OPT|C|set:c_c06_c⟧
# ·
Narración: ¿Quién modificó la antigua declaración de Lucian?

# CHAPTER 7｜El nombre bajo la cera
⟦GOAL|Aparece la firma de Lucian en un pago. ¿Cómo sigues?|El nombre bajo la cera⟧
⟦DONE|flag|c_c07_event|Observar el cambio clave|Narración: En su llavero cuelga una llave que abre la antigua sala de hospitalización.⟧
⟦DONE|say|Aparece la firma de Lucian en un pago. ¿Cómo sigues? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Archivo de sellos
⟦BG|bg_c_c07s01|Archivo de sellos — Abres el sobre antiguo. Contiene un recibo de un pago del convento a una institución privada de cuidados; el concepto está tachado con tinta.⟧
⟦TIME|21:30⟧
Narración: La cuarta noche. Archivo de sellos.
⟦IF|c_c06_a⟧
Narración: Admite firmar un registro antiguo y decide buscar el original por iniciativa propia.
⟦/IF⟧
⟦IF|c_c06_b⟧
Narración: Vuelve a ser testigo y no interfiere en tu colaboración con Nora.
⟦/IF⟧
⟦IF|c_c06_c⟧
Narración: La investigación sigue; Lucian solo puede entregar material en los horarios acordados.
⟦/IF⟧
Narración: Abres el sobre antiguo. Contiene un recibo de un pago del convento a una institución privada de cuidados; el concepto está tachado con tinta.
Nora: “El pago es del día siguiente a la supuesta alta de Mara.”
Nora: “¿Quieres investigar al destinatario o cotejar la cuenta personal de Agnes?”
⟦FREE⟧
Narración: Lucian palidece al ver la firma de la esquina inferior derecha.
Narración: Al anotar las partes visibles del recibo tachado, ¿quieres deslizar las fichas 📷 para ordenar 1–8? Puedes saltarlo.
⟦MG|g_slide_photo⟧

# SCENE｜Oficina de contabilidad
⟦BG|bg_c_c07s02|Oficina de contabilidad — Lucian admite haber guardado el dinero para Agnes creyendo que eran gastos normales de cuidados. Ahora sabe que había un problema grave. Al mencionar tú el dinero, retira la mano de la vela y busca el libro contable que firmó.⟧
⟦TIME|21:55⟧
Narración: Poco después. Oficina de contabilidad.
Narración: Lucian admite haber guardado el dinero para Agnes creyendo que eran gastos normales de cuidados. Ahora sabe que había un problema grave. Al mencionar tú el dinero, retira la mano de la vela y busca el libro contable que firmó.
Lucian: “La firma es mía. Ni siquiera pregunté por qué.”
Lucian: “¿Entrego el recibo a la investigadora o dejo inmediatamente de tocar tus pruebas?”
⟦FREE⟧
Narración: Por iniciativa propia recupera los movimientos de efectivo de entonces, incluido su nombre.
Narración: Antes de numerar las páginas de movimientos de efectivo, ¿quieres observar las cuatro luces y repetir su secuencia? Puedes saltarlo.
⟦MG|g_simon_lights⟧

# SCENE｜Pórtico nocturno
⟦BG|bg_c_c07s03|Pórtico nocturno — El viento hace parpadear las velas. Agnes llega por el pasillo y pregunta amablemente si te has acostumbrado a la cama.⟧
⟦TIME|22:20⟧
Narración: Poco después. Pórtico nocturno.
Narración: El viento hace parpadear las velas. Agnes llega por el pasillo y pregunta amablemente si te has acostumbrado a la cama.
Agnes: “No dejes que la culpa de un joven nuble tu juicio.”
Agnes: “¿Quieres preguntarme cómo se gastó aquel dinero o pedirme que no me acerque a tu habitación?”
⟦FREE⟧
Narración: En su llavero cuelga una llave que abre la antigua sala de hospitalización.
⟦SET|c_c07_event⟧

# CHOICE｜Aparece la firma de Lucian en un pago. ¿Cómo sigues?
#### A｜Exigir todos los recibos y registros de pagos
Narración: Su manejo del dinero entra en el expediente; no puede limitarse a decir que lo utilizaron.
⟦OPT|A|set:c_c07_a⟧
#### B｜Pedir a Nora que rastree el pago de forma independiente
Narración: Se verifican de forma independiente la cuenta de Agnes y los registros del centro.
⟦OPT|B|set:c_c07_b⟧
#### C｜Preguntar a Agnes quién autorizó el pago
Narración: Su explicación contradice las cuentas reales y servirá para contrastar su versión.
⟦OPT|C|set:c_c07_c⟧
# ·
Narración: ¿Es cómplice o un testigo al que utilizaron?

# CHAPTER 8｜La trampa de las siete noches
⟦GOAL|La obligación de siete noches es falsa. ¿Qué quieres ahora?|La trampa de las siete noches⟧
⟦DONE|flag|c_c08_event|Observar el cambio clave|Narración: Fuera, el cartero entrega a Nora un paquete reciente con una grabadora.⟧
⟦DONE|say|La obligación de siete noches es falsa. ¿Qué quieres ahora? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Despacho del abogado de tu abuela
⟦BG|bg_c_c08s01|Despacho del abogado de tu abuela — El abogado coteja el testamento original. Confirma que las siete noches no son condición legal: Agnes añadió la restricción por su cuenta.⟧
⟦TIME|09:00⟧
Narración: La mañana del quinto día. Despacho del abogado de tu abuela.
⟦IF|c_c07_a⟧
Narración: Su manejo del dinero entra en el expediente; no puede limitarse a decir que lo utilizaron.
⟦/IF⟧
⟦IF|c_c07_b⟧
Narración: Se verifican de forma independiente la cuenta de Agnes y los registros del centro.
⟦/IF⟧
⟦IF|c_c07_c⟧
Narración: Su explicación contradice las cuentas reales y servirá para contrastar su versión.
⟦/IF⟧
Narración: El abogado coteja el testamento original. Confirma que las siete noches no son condición legal: Agnes añadió la restricción por su cuenta.
Abogado: “No necesitas vivir aquí para recibir tu herencia legítima.”
Abogado: “¿Quieres solicitar la corrección o que persigamos primero la falsificación?”
⟦FREE⟧
Narración: Te entrega una solicitud de protección del patrimonio que puede tramitarse de inmediato.
Narración: Al ordenar los documentos de la solicitud de protección patrimonial, ¿quieres observar las cuatro luces y repetir su secuencia? Puedes saltarlo.
⟦MG|g_simon_lights⟧

# SCENE｜Habitación de invitados
⟦BG|bg_c_c08s02|Habitación de invitados — Nora abre un registro: durante siete años, quienes buscaban a Mara recibían alojamiento y luego cartas disuadiéndolos. Lucian organiza tu ruta de salida sin pedirte que demuestres que volverás.⟧
⟦TIME|09:25⟧
Narración: Poco después. Habitación de invitados.
Narración: Nora abre un registro: durante siete años, quienes buscaban a Mara recibían alojamiento y luego cartas disuadiéndolos. Lucian organiza tu ruta de salida sin pedirte que demuestres que volverás.
Nora: “Las siete noches no te ponen a prueba. Les dan tiempo para averiguar cuánto puedes descubrir.”
Nora: “¿Quieres marcharte ya o continuar como visitante independiente?”
⟦FREE⟧
Narración: La ventana no tiene cerrojo. Las llaves del coche siguen en tus manos.
Narración: Mientras Nora recoge los registros junto a la ruta de salida, ¿quieres buscar el sobre 💌 entre los iconos? Puedes saltarlo.
⟦MG|g_find_letter⟧

# SCENE｜Escalinata principal
⟦BG|bg_c_c08s03|Escalinata principal — Lucian entrega el horario del trayecto y todas las llaves de la puerta principal, sin pedirte que te quedes.⟧
⟦TIME|09:50⟧
Narración: Poco después. Escalinata principal.
Narración: Lucian entrega el horario del trayecto y todas las llaves de la puerta principal, sin pedirte que te quedes.
Lucian: “Vete cuando quieras. Hace siete años debí abrirle la puerta a alguien.”
Lucian: “¿Quieres que te acompañe a la salida o que en adelante solo contactemos mediante el abogado?”
⟦FREE⟧
Narración: Fuera, el cartero entrega a Nora un paquete reciente con una grabadora.
⟦SET|c_c08_event⟧

# CHOICE｜La obligación de siete noches es falsa. ¿Qué quieres ahora?
#### A｜Impugnar la condición añadida mediante el abogado
Narración: El abogado tramita la corrección legal; ya no te obliga la regla.
⟦OPT|A|set:c_c08_a⟧
#### B｜Salir de la abadía e investigar desde fuera
Narración: Investigas mediante visitas externas; nadie puede controlarte con el alojamiento.
⟦OPT|B|set:c_c08_b⟧
#### C｜Quedarte voluntariamente para revisar el archivo
Narración: Te quedas por voluntad propia y conservas el derecho independiente de irte cuando quieras.
⟦OPT|C|set:c_c08_c⟧
# ·
Narración: Las siete noches no son obligación. ¿Quién sigue teniendo motivos para impedir que salgas?

# CHAPTER 9｜Tu madre está viva
⟦GOAL|Por fin oyes a tu madre. ¿Cómo la buscarás?|Tu madre está viva⟧
⟦DONE|flag|c_c09_event|Observar el cambio clave|Narración: Tres golpes regulares suenan de pronto en el cristal del invernadero.⟧
⟦DONE|say|Por fin oyes a tu madre. ¿Cómo la buscarás? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Estudio de restauración de audio
⟦BG|bg_c_c09s01|Estudio de restauración de audio — Tú y Nora reproducís una grabación reciente. Se oye a Mara junto al parte meteorológico de ese día. Está viva.⟧
⟦TIME|10:00⟧
Narración: Más tarde esa mañana. Estudio de restauración de audio.
⟦IF|c_c08_a⟧
Narración: El abogado tramita la corrección legal; ya no te obliga la regla.
⟦/IF⟧
⟦IF|c_c08_b⟧
Narración: Investigas mediante visitas externas; nadie puede controlarte con el alojamiento.
⟦/IF⟧
⟦IF|c_c08_c⟧
Narración: Te quedas por voluntad propia y conservas el derecho independiente de irte cuando quieras.
⟦/IF⟧
Narración: Tú y Nora reproducís una grabación reciente. Se oye a Mara junto al parte meteorológico de ese día. Está viva. Ahora toca verificar los sonidos ambientales de la grabación reciente de tu madre.
Mara (grabación): “Si oyes esto, por fin he encontrado a alguien seguro.”
Mara (grabación): “¿Quieres verificar dónde lo grabé o buscar el matasellos que dejé?”
⟦FREE⟧
Narración: Lucian derriba la silla al levantarse. Por primera vez olvida disimular su reacción.
Narración: Antes de repetir la grabación para cotejar el parte meteorológico, ¿quieres buscar el sobre 💌 entre los iconos? Puedes saltarlo.
⟦MG|g_find_letter⟧

# SCENE｜Mesa del claustro por la mañana
⟦BG|bg_c_c09s02|Mesa del claustro por la mañana — En tu lista de pruebas, Lucian encuentra una anotación telefónica antigua: había dado erróneamente por muerta a Mara. Al oírla avanza un paso hacia ti y se obliga a parar.⟧
⟦TIME|10:25⟧
Narración: Poco después. Mesa del claustro por la mañana.
Narración: En tu lista de pruebas, Lucian encuentra una anotación telefónica antigua: había dado erróneamente por muerta a Mara. Al oírla avanza un paso hacia ti y se obliga a parar.
Lucian: “La convertí en pasado. Ella seguía esperando que alguien la creyera.”
Lucian: “¿Quieres que ayude a buscarla o que solo aporte las rutas de entonces?”
⟦FREE⟧
Narración: Con la uña despega lentamente la etiqueta «fallecida» del expediente antiguo.
Narración: Al dejar una nota al margen del registro telefónico para archivarlo, ¿quieres girar cartas y emparejar recuerdos iguales? Puedes saltarlo.
⟦MG|g_mem_memory⟧

# SCENE｜Invernadero de la abadía
⟦BG|bg_c_c09s03|Invernadero de la abadía — El buzón de la grabación sigue allí. Dentro encuentras papel reciente, un resguardo de consigna y un conocido botón rojo.⟧
⟦TIME|10:50⟧
Narración: Poco después. Invernadero de la abadía.
Narración: El buzón de la grabación sigue allí. Dentro encuentras papel reciente, un resguardo de consigna y un conocido botón rojo.
Nora: “Alguien lo dejó hace poco. Puede que esté cerca.”
Nora: “¿Esperarás aquí otra carta o seguirás el resguardo hasta la próxima parada?”
⟦FREE⟧
Narración: Tres golpes regulares suenan de pronto en el cristal del invernadero.
⟦SET|c_c09_event⟧

# CHOICE｜Por fin oyes a tu madre. ¿Cómo la buscarás?
#### A｜Verificar el lugar de la grabación
Narración: Nora verifica el paisaje sonoro y encauza la búsqueda por procedimientos legales y seguros.
⟦OPT|A|set:c_c09_a⟧
#### B｜Averiguar si Mara desea contacto directo
Narración: Dejas un mensaje mediante un contacto seguro sin revelar de golpe su ubicación.
⟦OPT|B|set:c_c09_b⟧
#### C｜Pedir los registros de rutas antiguas de Lucian
Narración: Entrega todos los mapas que conoce sin llevarte por su cuenta a ningún sitio.
⟦OPT|C|set:c_c09_c⟧
# ·
Narración: ¿Por qué tu madre está viva pero teme verte?

# CHAPTER 10｜El beso que casi ocurrió
⟦GOAL|¿Cómo afrontas el beso que casi ocurrió en el invernadero?|El beso que casi ocurrió⟧
⟦DONE|flag|c_c10_event|Observar el cambio clave|Narración: El abogado independiente envía autorización para recuperar legalmente los archivos de la antigua sala.⟧
⟦DONE|say|¿Cómo afrontas el beso que casi ocurrió en el invernadero? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Pasillo del invernadero
⟦BG|bg_c_c10s01|Pasillo del invernadero — El viento y la lluvia sacuden el cristal. Con la lámpara en la mano, Lucian se detiene a tu alcance sin cerrarte el paso. Se queda a un paso y contiene hasta el impulso de tocar tu manga.⟧
⟦TIME|19:00⟧
Narración: La quinta noche. Pasillo del invernadero.
⟦IF|c_c09_a⟧
Narración: Nora verifica el paisaje sonoro y encauza la búsqueda por procedimientos legales y seguros.
⟦/IF⟧
⟦IF|c_c09_b⟧
Narración: Dejas un mensaje mediante un contacto seguro sin revelar de golpe su ubicación.
⟦/IF⟧
⟦IF|c_c09_c⟧
Narración: Entrega todos los mapas que conoce sin llevarte por su cuenta a ningún sitio.
⟦/IF⟧
Narración: El viento y la lluvia sacuden el cristal. Con la lámpara en la mano, Lucian se detiene a tu alcance sin cerrarte el paso. Se queda a un paso y contiene hasta el impulso de tocar tu manga.
Lucian: “Ahora deseo besarte más que nada, pero temo que parezca que pido absolución.”
Lucian: “¿Quieres que deje de hablar de esto o decidirás tú la distancia?”
⟦FREE⟧
Narración: Una carta nueva a vuestros pies indica la ruta de Mara para esa noche.

# SCENE｜Mesa de trabajo del invernadero
⟦BG|bg_c_c10s02|Mesa de trabajo del invernadero — La carta marca tres senderos seguros. Lucian reconoce uno hacia la puerta trasera del antiguo centro. Admite querer acercarse, pero que encontrar a tu madre importa más que su deseo.⟧
⟦TIME|19:25⟧
Narración: Poco después. Mesa de trabajo del invernadero.
Narración: La carta marca tres senderos seguros. Lucian reconoce uno hacia la puerta trasera del antiguo centro. Admite querer acercarse, pero que encontrar a tu madre importa más que su deseo.
Nora: “No se esconde de ti. Se esconde de quienes aún controlan la antigua clínica.”
Nora: “¿Quieres la ruta más corta o que la investigadora compruebe primero que es segura?”
⟦FREE⟧
Narración: Un antiguo registro de tutela demuestra que Agnes sigue interfiriendo en los desplazamientos de Mara.

# SCENE｜Alero del invernadero
⟦BG|bg_c_c10s03|Alero del invernadero — Lucian deja el paraguas a tu lado y se queda bajo la lluvia. Sin acercarse, expresa por primera vez claramente qué relación desea.⟧
⟦TIME|19:50⟧
Narración: Poco después. Alero del invernadero.
Narración: Lucian deja el paraguas a tu lado y se queda bajo la lluvia. Sin acercarse, expresa por primera vez claramente qué relación desea.
Lucian: “Quiero estar contigo. Pero quiero aún más traer primero a tu madre a salvo.”
Lucian: “¿Quieres que me quede como testigo o que te acompañe a buscarla como una persona corriente?”
⟦FREE⟧
Narración: El abogado independiente envía autorización para recuperar legalmente los archivos de la antigua sala.
Narración: Mientras se reúnen los documentos tras llegar la autorización, ¿quieres girar cartas y emparejar recuerdos iguales? Puedes saltarlo.
⟦MG|g_mem_memory⟧
Narración: Antes de recoger la copia de la autorización bajo el alero, ¿quieres deslizar las fichas 📷 para ordenar 1–8? Puedes saltarlo.
⟦MG|g_slide_photo⟧
⟦SET|c_c10_event⟧

# CHOICE｜¿Cómo afrontas el beso que casi ocurrió en el invernadero?
#### A｜Expresar el deseo de cercanía sin perdonarlo
Narración: Tu deseo de cercanía queda claro; pruebas y responsabilidad se tramitan por separado.
⟦OPT|A|set:c_c10_a⟧
#### B｜Pedirle que no se acerque íntimamente
Narración: Respeta la distancia y nunca interpreta después el rechazo como coqueteo.
⟦OPT|B|set:c_c10_b⟧
#### C｜Priorizar la seguridad de Mara
Narración: Continúa la colaboración; los sentimientos no se anteponen al rescate.
⟦OPT|C|set:c_c10_c⟧
# ·
Narración: La antigua tutela sigue usándose. ¿Dónde se oculta tu madre?

# CHAPTER 11｜La habitación cerrada
⟦GOAL|Aparecen la cerradura y las órdenes médicas. ¿Qué conservas primero?|La habitación cerrada⟧
⟦DONE|flag|c_c11_event|Observar el cambio clave|Narración: Al ver las fotos originales de la cerradura, el abogado deja por fin de bloquear la puerta.⟧
⟦DONE|say|Aparecen la cerradura y las órdenes médicas. ¿Qué conservas primero? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Sala del antiguo centro asistencial
⟦BG|bg_c_c11s01|Sala del antiguo centro asistencial — La cerradura oxidada solo se abre desde fuera. En la esquina están las marcas de calendario de Mara, casi sin días vacíos.⟧
⟦TIME|11:00⟧
Narración: La mañana del sexto día. Sala del antiguo centro asistencial.
⟦IF|c_c10_a⟧
Narración: Tu deseo de cercanía queda claro; pruebas y responsabilidad se tramitan por separado.
⟦/IF⟧
⟦IF|c_c10_b⟧
Narración: Respeta la distancia y nunca interpreta después el rechazo como coqueteo.
⟦/IF⟧
⟦IF|c_c10_c⟧
Narración: Continúa la colaboración; los sentimientos no se anteponen al rescate.
⟦/IF⟧
Narración: La cerradura oxidada solo se abre desde fuera. En la esquina están las marcas de calendario de Mara, casi sin días vacíos. Ahora toca verificar que la puerta de la sala solo se cierra desde fuera.
Nora: “Nada aquí parece un ingreso voluntario.”
Nora: “¿Fotografías primero la cerradura o examinamos la orden médica obligatoria?”
⟦FREE⟧
Narración: Al ver las marcas, Lucian se apoya de pronto en el marco y toma aire.
Narración: Antes de documentar por separado la cerradura y las marcas, ¿quieres deslizar las fichas 📷 para ordenar 1–8? Puedes saltarlo.
⟦MG|g_slide_photo⟧

# SCENE｜Archivador de la sala
⟦BG|bg_c_c11s02|Archivador de la sala — Lucian reconoce que trajo a Mara, creyendo erróneamente la explicación de Agnes sobre el tratamiento. Entrega el registro a Nora sin pedir que le toques la mano. Ante las marcas del calendario llora por primera vez en silencio, sin pedir perdón mediante las lágrimas.⟧
⟦TIME|11:25⟧
Narración: Poco después. Archivador de la sala.
Narración: Lucian reconoce que trajo a Mara, creyendo erróneamente la explicación de Agnes sobre el tratamiento. Entrega el registro a Nora sin pedir que le toques la mano. Ante las marcas del calendario llora por primera vez en silencio, sin pedir perdón mediante las lágrimas.
Lucian: “Me decía que mejoraría. En realidad, temía cuestionar a mis superiores.”
Lucian: “¿Quieres que declare ante el tribunal o que escriba primero todo lo ocurrido, punto por punto?”
⟦FREE⟧
Narración: Al final del expediente aparece una hoja añadida: un certificado de alta con fecha alterada.
Narración: Al numerar la última hoja clínica tras entregar el registro a Nora, ¿quieres observar las cuatro luces y repetir su secuencia? Puedes saltarlo.
⟦MG|g_simon_lights⟧

# SCENE｜Salida del centro
⟦BG|bg_c_c11s03|Salida del centro — Nora sella en una bolsa de pruebas la orden médica, las fotos de la cerradura y el cuadrante de turnos. Fuera espera el abogado de Agnes.⟧
⟦TIME|11:50⟧
Narración: Poco después. Salida del centro.
Narración: Nora sella en una bolsa de pruebas la orden médica, las fotos de la cerradura y el cuadrante de turnos. Fuera espera el abogado de Agnes.
Abogado de Agnes: “No pueden llevarse estos documentos sin más.”
Abogado de Agnes: “¿Mostrarás la autorización legal o Nora los registrará directamente ante los investigadores?”
⟦FREE⟧
Narración: Al ver las fotos originales de la cerradura, el abogado deja por fin de bloquear la puerta.
⟦SET|c_c11_event⟧

# CHOICE｜Aparecen la cerradura y las órdenes médicas. ¿Qué conservas primero?
#### A｜Fotografiar la cerradura y conservar las huellas de la sala
Narración: Quedan documentadas las pruebas físicas de la privación de libertad.
⟦OPT|A|set:c_c11_a⟧
#### B｜Exigir a Lucian un relato completo por escrito
Narración: Admite haber confiado indebidamente en la dirección y lo convierte en testimonio formal.
⟦OPT|B|set:c_c11_b⟧
#### C｜Pedir a los investigadores que obtengan los originales
Narración: Los documentos se aseguran legalmente para que una disputa privada no destruya las pruebas.
⟦OPT|C|set:c_c11_c⟧
# ·
Narración: ¿Quién puede pedir perdón por aquellos daños?

# CHAPTER 12｜El certificado falso que firmó
⟦GOAL|Descubres que Lucian firmó una declaración falsa. ¿Qué exiges?|El certificado falso que firmó⟧
⟦DONE|flag|c_c12_event|Observar el cambio clave|Narración: El abogado recibe noticia: Mara acepta verte, pero pide mantener el lugar en secreto.⟧
⟦DONE|say|Descubres que Lucian firmó una declaración falsa. ¿Qué exiges? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Archivo notarial
⟦BG|bg_c_c12s01|Archivo notarial — Aparece el certificado original de alta. La firma manuscrita de Lucian está fechada con exactamente tres días de diferencia respecto al hecho real.⟧
⟦TIME|15:00⟧
Narración: Esa tarde. Archivo notarial.
⟦IF|c_c11_a⟧
Narración: Quedan documentadas las pruebas físicas de la privación de libertad.
⟦/IF⟧
⟦IF|c_c11_b⟧
Narración: Admite haber confiado indebidamente en la dirección y lo convierte en testimonio formal.
⟦/IF⟧
⟦IF|c_c11_c⟧
Narración: Los documentos se aseguran legalmente para que una disputa privada no destruya las pruebas.
⟦/IF⟧
Narración: Aparece el certificado original de alta. La firma manuscrita de Lucian está fechada con exactamente tres días de diferencia respecto al hecho real. Ahora toca cotejar la letra y las fechas modificadas del certificado de alta.
Notario: “No es un simple error de copia. Alguien alteró los hechos deliberadamente.”
Notario: “¿Quieres que se explique primero o enviarlo directamente a peritaje?”
⟦FREE⟧
Narración: Lucian se apoya en la puerta sin intención de huir.
Narración: Al ordenar las copias del alta original para el peritaje, ¿quieres observar las cuatro luces y repetir su secuencia? Puedes saltarlo.
⟦MG|g_simon_lights⟧

# SCENE｜Sala de espera de la estación suburbana
⟦BG|bg_c_c12s02|Sala de espera de la estación suburbana — Lucian admite que al firmar ya sabía que Mara no tenía permiso para salir. Firmó para proteger la reputación del convento. Su mano está más firme que en cualquier oración; ahora no tiembla al escribir hechos que lo perjudican.⟧
⟦TIME|15:25⟧
Narración: Poco después. Sala de espera de la estación suburbana.
Narración: Lucian admite que al firmar ya sabía que Mara no tenía permiso para salir. Firmó para proteger la reputación del convento. Su mano está más firme que en cualquier oración; ahora no tiembla al escribir hechos que lo perjudican.
Lucian: “Temía ofender a Agnes. Y quien sufrió fue tu madre.”
Lucian: “¿Quieres que lo reconozca públicamente ahora o que deje de verte por un tiempo?”
⟦FREE⟧
Narración: Escribe una confesión completa para entregarla a los investigadores.
Narración: Mientras se ordenan la declaración completa y los papeles para entregarla, ¿quieres buscar el sobre 💌 entre los iconos? Puedes saltarlo.
⟦MG|g_find_letter⟧

# SCENE｜Sala de reuniones del abogado
⟦BG|bg_c_c12s03|Sala de reuniones del abogado — Tú y Nora comprobáis el destino de las pruebas. Lucian firma delante de ti una declaración complementaria en su contra.⟧
⟦TIME|15:50⟧
Narración: Poco después. Sala de reuniones del abogado.
Narración: Tú y Nora comprobáis el destino de las pruebas. Lucian firma delante de ti una declaración complementaria en su contra.
Nora: “Que asuma su responsabilidad no significa que le debas otra oportunidad.”
Nora: “¿Quieres que me encargue de las comunicaciones o mantener el contacto directo con él?”
⟦FREE⟧
Narración: El abogado recibe noticia: Mara acepta verte, pero pide mantener el lugar en secreto.
⟦SET|c_c12_event⟧

# CHOICE｜Descubres que Lucian firmó una declaración falsa. ¿Qué exiges?
#### A｜Exigir una admisión formal y testimonio
Narración: Firma un testimonio en su contra y empieza a asumir responsabilidad procesal.
⟦OPT|A|set:c_c12_a⟧
#### B｜Suspender el contacto privado y utilizar a Nora como intermediaria
Narración: Se pausa la intimidad y sigue la investigación.
⟦OPT|B|set:c_c12_b⟧
#### C｜Dejar abierta la posibilidad de contacto futuro sin perdonar la falsedad
Narración: Ambos separan sentimientos y expiación; la confianza no puede restablecerse por adelantado.
⟦OPT|C|set:c_c12_c⟧
# ·
Narración: ¿Tiene aún la falsedad firmada por Lucian costes que no ha contado?

# CHAPTER 13｜Mamá vuelve bajo la lluvia
⟦GOAL|Tu madre vuelve por fin. ¿Qué le das primero?|Mamá vuelve bajo la lluvia⟧
⟦DONE|flag|c_c13_event|Observar el cambio clave|Narración: Nora confirma que los documentos completan los eslabones que faltaban en la cadena de pruebas.⟧
⟦DONE|say|Tu madre vuelve por fin. ¿Qué le das primero? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Estación rural
⟦BG|bg_c_c13s01|Estación rural — Nora acompaña bajo la lluvia a una mujer delgada. Al levantar ella la cabeza, reconoces los ojos de la fotografía.⟧
⟦TIME|09:00⟧
Narración: La mañana del séptimo día. Estación rural.
⟦IF|c_c12_a⟧
Narración: Firma un testimonio en su contra y empieza a asumir responsabilidad procesal.
⟦/IF⟧
⟦IF|c_c12_b⟧
Narración: Se pausa la intimidad y sigue la investigación.
⟦/IF⟧
⟦IF|c_c12_c⟧
Narración: Ambos separan sentimientos y expiación; la confianza no puede restablecerse por adelantado.
⟦/IF⟧
Narración: Nora acompaña bajo la lluvia a una mujer delgada. Al levantar ella la cabeza, reconoces los ojos de la fotografía.
Mara: “Llego siete años tarde. No puedo pedirte que me abraces de inmediato.”
Mara: “¿Quieres preguntar dónde he estado o sentarnos en un lugar tranquilo?”
⟦FREE⟧
Narración: Mara aprieta la vieja bufanda que llevaba la niña del cuadro.

# SCENE｜Posada de un pueblo tranquilo
⟦BG|bg_c_c13s02|Posada de un pueblo tranquilo — Mara extiende recibos de siete años cambiando de alojamiento; le tiemblan los dedos. Explica la falsa tutela y las amenazas que la controlaban. Te mira y comprueba la puerta: solo sigue cuando confirma que Lucian no está.⟧
⟦TIME|09:25⟧
Narración: Poco después. Posada de un pueblo tranquilo.
Narración: Mara extiende recibos de siete años cambiando de alojamiento; le tiemblan los dedos. Explica la falsa tutela y las amenazas que la controlaban. Te mira y comprueba la puerta: solo sigue cuando confirma que Lucian no está.
Mara: “Cada vez que iba a buscarte, amenazaban con destruir tu vida.”
Mara: “¿Quieres escuchar todo lo ocurrido o confirmar primero que ahora estoy a salvo?”
⟦FREE⟧
Narración: Saca una tarjeta nunca enviada por tu vigesimonoveno cumpleaños, dirigida a ti.

# SCENE｜Sala privada de reunión familiar
⟦BG|bg_c_c13s03|Sala privada de reunión familiar — Mara entrega a Nora pagos que vinculan a Agnes con los expedientes médicos falsos. Lucian no está ni escucha a escondidas la conversación de madre e hija.⟧
⟦TIME|09:50⟧
Narración: Poco después. Sala privada de reunión familiar.
Narración: Mara entrega a Nora pagos que vinculan a Agnes con los expedientes médicos falsos. Lucian no está ni escucha a escondidas la conversación de madre e hija.
Mara: “Registraron mi huida como una marcha voluntaria.”
Mara: “¿Quieres proteger primero mi intimidad o decidir qué documento puede publicarse?”
⟦FREE⟧
Narración: Nora confirma que los documentos completan los eslabones que faltaban en la cadena de pruebas.
Narración: Al revisar la lista de entrega tras recibir Nora los pagos, ¿quieres buscar el sobre 💌 entre los iconos? Puedes saltarlo.
⟦MG|g_find_letter⟧
Narración: Al marcar por separado los registros que tu madre permite publicar, ¿quieres girar cartas y emparejar recuerdos iguales? Puedes saltarlo.
⟦MG|g_mem_memory⟧
⟦SET|c_c13_event⟧

# CHOICE｜Tu madre vuelve por fin. ¿Qué le das primero?
#### A｜Priorizar la seguridad y la salud de Mara
Narración: Nora organiza alojamiento seguro y protección independiente para tu madre.
⟦OPT|A|set:c_c13_a⟧
#### B｜Escuchar lo que Mara desee compartir
Narración: No tiene que narrar los siete años de golpe; puede hablar a su ritmo.
⟦OPT|B|set:c_c13_b⟧
#### C｜Mantener cierta distancia hasta estar preparada
Narración: Respeta tus límites; la reunión no impone un abrazo.
⟦OPT|C|set:c_c13_c⟧
# ·
Narración: ¿Estás dispuesta a afrontar con ella la exposición pública?

# CHAPTER 14｜Una confesión de verdad
⟦GOAL|Tras reconocer públicamente su culpa, ¿cómo afrontas a Lucian?|Una confesión de verdad⟧
⟦DONE|flag|c_c14_event|Observar el cambio clave|Narración: La última vela se consume. Mañana termina la séptima noche.⟧
⟦DONE|say|Tras reconocer públicamente su culpa, ¿cómo afrontas a Lucian? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Sala de audiencia independiente
⟦BG|bg_c_c14s01|Sala de audiencia independiente — En la declaración de la audiencia, Lucian admite haber firmado un certificado falso. Ya no se excusa con viejos votos.⟧
⟦TIME|14:00⟧
Narración: Esa tarde. Sala de audiencia independiente.
⟦IF|c_c13_a⟧
Narración: Nora organiza alojamiento seguro y protección independiente para tu madre.
⟦/IF⟧
⟦IF|c_c13_b⟧
Narración: No tiene que narrar los siete años de golpe; puede hablar a su ritmo.
⟦/IF⟧
⟦IF|c_c13_c⟧
Narración: Respeta tus límites; la reunión no impone un abrazo.
⟦/IF⟧
Narración: En la declaración de la audiencia, Lucian admite haber firmado un certificado falso. Ya no se excusa con viejos votos.
Lucian: “Sabía que no se había ido. Aun así escribí que sí.”
Lucian: “¿Quieres preguntarme tú o que la investigadora lo registre todo?”
⟦FREE⟧
Narración: El secretario anota cada palabra sobre su responsabilidad. Nadie modifica nada por amor.

# SCENE｜Escalinata de la abadía
⟦BG|bg_c_c14s02|Escalinata de la abadía — Se limita temporalmente la autoridad administrativa de Agnes. Investigan los registros médicos y financieros. Tras declarar públicamente, Lucian no busca tu perdón entre el público.⟧
⟦TIME|14:25⟧
Narración: Poco después. Escalinata de la abadía.
Narración: Se limita temporalmente la autoridad administrativa de Agnes. Investigan los registros médicos y financieros. Tras declarar públicamente, Lucian no busca tu perdón entre el público.
Nora: “Hoy no se cierra el caso. Por fin alguien está dispuesto a investigarlo.”
Nora: “¿Quieres ver a tu madre o inventariar primero los archivos aún inéditos?”
⟦FREE⟧
Narración: La puerta del convento está abierta. Retiran de ella la norma de las siete noches.

# SCENE｜Último banco de la capilla
⟦BG|bg_c_c14s03|Último banco de la capilla — Lucian está en el último banco. No te pide que te quedes; se disculpa solemnemente por cada silencio de entonces.⟧
⟦TIME|14:50⟧
Narración: Poco después. Último banco de la capilla.
Narración: Lucian está en el último banco. No te pide que te quedes; se disculpa solemnemente por cada silencio de entonces.
Lucian: “Antes quería que me perdonaras. Luego entendí que no debía exigirlo.”
Lucian: “¿Quieres que siga respondiendo preguntas o que solo contactemos por canales formales?”
⟦FREE⟧
Narración: La última vela se consume. Mañana termina la séptima noche.
Narración: Al ordenar tus copias de la audiencia antes de marcharte, ¿quieres girar cartas y emparejar recuerdos iguales? Puedes saltarlo.
⟦MG|g_mem_memory⟧
Narración: Antes de guardar en la carpeta los papeles de contacto formal junto al banco, ¿quieres deslizar las fichas 📷 para ordenar 1–8? Puedes saltarlo.
⟦MG|g_slide_photo⟧
⟦SET|c_c14_event⟧

# CHOICE｜Tras reconocer públicamente su culpa, ¿cómo afrontas a Lucian?
#### A｜Exigir más testimonio y revelaciones
Narración: Su responsabilidad sigue en el procedimiento formal, más allá de una disculpa.
⟦OPT|A|set:c_c14_a⟧
#### B｜Limitar el contacto futuro a lo necesario
Narración: Quedan claros los límites y la investigación continúa sin interferencias.
⟦OPT|B|set:c_c14_b⟧
#### C｜Expresar una posible atracción y exigir cambios duraderos
Narración: Acepta que debe demostrar cambios duraderos y no pide recompensa inmediata.
⟦OPT|C|set:c_c14_c⟧
# ·
Narración: ¿Puede un hombre que asume públicamente su culpa volver a conocerte en verdadera igualdad?

# CHAPTER 15｜Libertad en la séptima noche
⟦GOAL|Terminan las siete noches. ¿Cómo gestionas herencia y sentimientos?|Libertad en la séptima noche⟧
⟦DONE|flag|c_c15_event|Observar el cambio clave|Narración: Empieza a clarear. Por primera vez, la campana del convento no sigue su horario habitual.⟧
⟦DONE|say|Terminan las siete noches. ¿Cómo gestionas herencia y sentimientos? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Despacho del abogado de tu abuela
⟦BG|bg_c_c15s01|Despacho del abogado de tu abuela — El abogado declara inválida la condición añadida de siete noches. Tienes derecho a gestionar la herencia de forma independiente.⟧
⟦TIME|21:00⟧
Narración: La séptima noche. Despacho del abogado de tu abuela.
⟦IF|c_c14_a⟧
Narración: Su responsabilidad sigue en el procedimiento formal, más allá de una disculpa.
⟦/IF⟧
⟦IF|c_c14_b⟧
Narración: Quedan claros los límites y la investigación continúa sin interferencias.
⟦/IF⟧
⟦IF|c_c14_c⟧
Narración: Acepta que debe demostrar cambios duraderos y no pide recompensa inmediata.
⟦/IF⟧
Narración: El abogado declara inválida la condición añadida de siete noches. Tienes derecho a gestionar la herencia de forma independiente.
Abogado: “Nadie puede cambiar tu firma por el tiempo que te alojes.”
Abogado: “¿Quieres conservar la finca o abrir sus archivos al público?”
⟦FREE⟧
Narración: Las campanas de la séptima noche llegan desde lejos. Ya no suenan como una orden.
Narración: Al guardar las copias de la solicitud tras confirmar las condiciones, ¿quieres deslizar las fichas 📷 para ordenar 1–8? Puedes saltarlo.
⟦MG|g_slide_photo⟧

# SCENE｜Exterior del muro de la abadía
⟦BG|bg_c_c15s02|Exterior del muro de la abadía — Lucian entrega todas las llaves al nuevo administrador. Ya no puede entrar en la antigua sala ni pregunta adónde irás después. Al soltar la última llave su mano queda vacía y su mirada deja de esquivar la tuya.⟧
⟦TIME|21:25⟧
Narración: Poco después. Exterior del muro de la abadía.
Narración: Lucian entrega todas las llaves al nuevo administrador. Ya no puede entrar en la antigua sala ni pregunta adónde irás después. Al soltar la última llave su mano queda vacía y su mirada deja de esquivar la tuya.
Lucian: “Si quieres, espero poder darte los buenos días algún día como una persona corriente.”
Lucian: “¿Quieres seguir en contacto o que esta noche sea nuestra despedida?”
⟦FREE⟧
Narración: Solo queda en su bolsillo la lista de pruebas que cotejasteis juntos.
Narración: Al revisar la lista de pruebas tras devolver la última llave, ¿quieres observar las cuatro luces y repetir su secuencia? Puedes saltarlo.
⟦MG|g_simon_lights⟧

# SCENE｜Claustro en la séptima noche
⟦BG|bg_c_c15s03|Claustro en la séptima noche — Tu madre espera bajo la lámpara. Nora te entrega los documentos con acuse de recibo. Nadie vuelve a bloquear el pasillo.⟧
⟦TIME|21:50⟧
Narración: Poco después. Claustro en la séptima noche.
Narración: Tu madre espera bajo la lámpara. Nora te entrega los documentos con acuse de recibo. Nadie vuelve a bloquear el pasillo.
Mara: “Vayas donde vayas esta vez, no permitiré que otros decidan por ti.”
Mara: “¿Quieres irte conmigo o tener un tiempo a solas?”
⟦FREE⟧
Narración: Empieza a clarear. Por primera vez, la campana del convento no sigue su horario habitual.
⟦SET|c_c15_event⟧

# CHOICE｜Terminan las siete noches. ¿Cómo gestionas herencia y sentimientos?
#### A｜Apoyar el acceso legal a los archivos
Narración: Empieza la transformación de la biblioteca para hacer públicos sus materiales.
⟦OPT|A|set:c_c15_a⟧
#### B｜Priorizar la herencia y la recuperación familiar
Narración: Tu madre participa en las decisiones; el romance puede esperar.
⟦OPT|B|set:c_c15_b⟧
#### C｜Marcharte y reconsiderar cualquier relación privada más adelante
Narración: Ninguno promete una reconciliación inmediata; tu libertad no tiene restricciones.
⟦OPT|C|set:c_c15_c⟧
# ·
Narración: ¿Qué quieres llevarte cuando te marches?

# CHAPTER 16｜La elección a la luz de la mañana
⟦GOAL|Si volvierais a conoceros, ¿qué relación querrías?|La elección a la luz de la mañana⟧
⟦DONE|flag|c_c16_event|Observar el cambio clave|Narración: La luz ilumina el rosario que guardaba secretos. Ya nadie decide por otro qué significa.⟧
⟦DONE|say|Si volvierais a conoceros, ¿qué relación querrías? Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.|Expresar tu intención|Narración: Puedes preguntar, acercarte, rechazar o aplazar. Expón tus condiciones o pide verificar primero.⟧

# SCENE｜Archivo público
⟦BG|bg_c_c16s01|Archivo público — La vieja biblioteca del convento es ahora un archivo público. A la entrada figuran los donantes; nadie encierra secretos en el sótano.⟧
⟦TIME|10:00⟧
Narración: Seis meses después. Archivo público.
⟦IF|c_c15_a⟧
Narración: Empieza la transformación de la biblioteca para hacer públicos sus materiales.
⟦/IF⟧
⟦IF|c_c15_b⟧
Narración: Tu madre participa en las decisiones; el romance puede esperar.
⟦/IF⟧
⟦IF|c_c15_c⟧
Narración: Ninguno promete una reconciliación inmediata; tu libertad no tiene restricciones.
⟦/IF⟧
Narración: La vieja biblioteca del convento es ahora un archivo público. A la entrada figuran los donantes; nadie encierra secretos en el sótano.
Nora: “El caso sigue su curso, pero estos documentos ya pueden verse.”
Nora: “¿Quieres ver la obra nueva de tu madre o el antiguo registro ahora público?”
⟦FREE⟧
Narración: El nombre de Lucian aparece al final de una declaración publicada legalmente.
Narración: Antes de pasar una página de los antiguos registros del archivo público, ¿quieres observar las cuatro luces y repetir su secuencia? Puedes saltarlo.
⟦MG|g_simon_lights⟧

# SCENE｜Mesa occidental del archivo
⟦BG|bg_c_c16s02|Mesa occidental del archivo — Lucian llega a la mesa a la hora acordada, sin aprovechar un puesto de empleado para acercarse. Trae un cuaderno corriente con los avances de su responsabilidad. El sol ilumina la mesa; quiere hablar del tiempo, pero espera a que decidas si te sientas.⟧
⟦TIME|10:25⟧
Narración: Poco después. Mesa occidental del archivo.
Narración: Lucian llega a la mesa a la hora acordada, sin aprovechar un puesto de empleado para acercarse. Trae un cuaderno corriente con los avances de su responsabilidad. El sol ilumina la mesa; quiere hablar del tiempo, pero espera a que decidas si te sientas.
Lucian: “Si podemos volver a conocernos, quisiera empezar por una tarde sin mentiras.”
Lucian: “¿Quieres hablar de hoy o dejar este cuaderno en el archivo?”
⟦FREE⟧
Narración: Fuera, Mara planta flores de temporada con los voluntarios.
Narración: Antes de decidir si lees el cuaderno corriente de la mesa, ¿quieres buscar el sobre 💌 entre los iconos? Puedes saltarlo.
⟦MG|g_find_letter⟧

# SCENE｜Sendero del valle por la mañana
⟦BG|bg_c_c16s03|Sendero del valle por la mañana — La niebla se levanta. El edificio conocido ya no encierra a nadie. Pasas por el cruce y cada camino queda a tu elección.⟧
⟦TIME|10:50⟧
Narración: Poco después. Sendero del valle por la mañana.
Narración: La niebla se levanta. El edificio conocido ya no encierra a nadie. Pasas por el cruce y cada camino queda a tu elección.
Lucian: “Quiero caminar contigo un trecho. También aceptaré que prefieras seguir sola.”
Lucian: “¿Qué relación te gustaría que tuviéramos, o prefieres no responder todavía?”
⟦FREE⟧
Narración: La luz ilumina el rosario que guardaba secretos. Ya nadie decide por otro qué significa.
⟦SET|c_c16_event⟧

# CHOICE｜Si volvierais a conoceros, ¿qué relación querrías?
#### A｜Elegir expresamente un romance igualitario cuando la responsabilidad y los límites lo permitan
Narración: Solo tu deseo romántico explícito permite un trato cotidiano igualitario; el procedimiento de responsabilidad sigue.
⟦OPT|A|set:c_c16_a⟧
#### B｜Elegir la amistad y el trabajo compartido en el archivo
Narración: La relación continúa con límites claros, sin obligación romántica.
⟦OPT|B|set:c_c16_b⟧
#### C｜Elegir tu próxima vida independiente y terminar el contacto privado
Narración: Te marchas con un desenlace completo que no exige amor para demostrar redención.
⟦OPT|C|set:c_c16_c⟧
# ·
Narración: La puerta está abierta al amanecer. La confesión ya no es una cadena.
