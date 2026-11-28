# CHAPTER 1｜La puerta que no debías abrir
⟦GOAL|¿A quién entregas primero la foto de hace tres años?|La puerta que no debías abrir⟧
⟦DONE|flag|a_c01_event|Observar el cambio clave|Narración: Fuera del despacho se acercan los pasos de Ethan. El pomo gira lentamente.⟧
⟦DONE|say|¿A quién entregas primero la foto de hace tres años? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Pasillo de la finca de la boda
⟦BG|bg_a_c01s01|Pasillo de la finca de la boda⟧
⟦TIME|22:30⟧
Narración: La noche anterior a la boda — Pasillo de la finca de la boda.
Narración: Ordenar objetos del pasillo como iconos: Busca 💌 entre los iconos durante tres rondas. Puedes saltarlo.
⟦MG|g_find_letter⟧
Narración: El proyector muestra vuestras fotos de compromiso, pero Ethan besa a una mujer de vestido dorado fuera del alcance de las cámaras. Al verte, la atrae aún más hacia él.
Ethan: “¿Incluso al verme así, tu primer impulso es buscarlo a él?”
Ethan: “¿Quieres saber quién es ella o por qué me aseguré de que lo vieras?”
⟦FREE⟧
Narración: Al marcharse, la mujer deja caer deliberadamente un pendiente grabado con el escudo familiar.

# SCENE｜Habitación de Damian
⟦BG|bg_a_c01s02|Habitación de Damian⟧
⟦TIME|22:55⟧
Narración: Un poco después — Habitación de Damian.
Narración: Al final del pasillo, la puerta se abre desde dentro. Damian lleva los puños sueltos y sostiene el viejo botón que le prestaste durante la tormenta de hace tres años. Ve pasar una sombra y cierra sin echar la llave. Al ver tu anillo, te deja libre la salida, aunque no aparta la mirada de tu rostro.
Damian: “Aquel día dijiste que no usáramos nombres reales. Ahora apenas me atrevo a pronunciar el tuyo.”
Damian: “¿Has venido a oír la verdad o prefieres insultarme primero?”
⟦FREE⟧
Narración: En su escritorio está el plano de asientos para la boda de mañana; tu nombre aparece rodeado en rojo.

# SCENE｜Biblioteca familiar
⟦BG|bg_a_c01s03|Biblioteca familiar⟧
⟦TIME|23:20⟧
Narración: Un poco después — Biblioteca familiar.
Narración: Practicar un índice para la foto del despacho: Voltea cartas y empareja seis parejas de recuerdos, con un máximo de ocho fallos. Puedes saltarlo.
⟦MG|g_mem_memory⟧
Narración: Damian saca la foto de aquella noche de lluvia: estáis juntos junto a una máquina expendedora del hospital. Detrás aparece la letra de Ethan.
Damian: “No sé cuándo la tomó. Pero sabe mucho más de lo que crees.”
Damian: “¿Vas a pedirle explicaciones con esta foto o me dejas terminar de contar aquella noche?”
⟦FREE⟧
Narración: Fuera del despacho se acercan los pasos de Ethan. El pomo gira lentamente.
⟦SET|a_c01_event⟧

# CHOICE｜¿A quién entregas primero la foto de hace tres años?
#### A｜Pedir a Damian explicaciones y el original
Narración: Deja el álbum y la funda de negativos en el despacho sin seguir ocultando las fechas.
⟦OPT|A|set:a_c01_a⟧
#### B｜Enfrentarte inmediatamente a Ethan con la foto
Narración: Recibe una copia y al día siguiente no puede fingir que no sabía nada.
⟦OPT|B|set:a_c01_b⟧
#### C｜Fotografiar la prueba y alejarte de ambos
Narración: Ninguno recibe tu respuesta; conservas tú el original.
⟦OPT|C|set:a_c01_c⟧
# ·
Narración: ¿Quién convirtió primero el secreto de aquella noche en moneda de cambio?

# CHAPTER 2｜La trampa del prometido
⟦GOAL|¿Qué haces antes de que empiece la ceremonia de hoy?|La trampa del prometido⟧
⟦DONE|flag|a_c02_event|Observar el cambio clave|Narración: La impresora expulsa automáticamente un anexo de autorización prematrimonial con tu nombre.⟧
⟦DONE|say|¿Qué haces antes de que empiece la ceremonia de hoy? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Comedor
⟦BG|bg_a_c02s01|Comedor⟧
⟦TIME|07:00⟧
Narración: A primera hora de la mañana de la boda — Comedor.
⟦IF|a_c01_a⟧
Narración: Deja el álbum y la funda de negativos en el despacho sin seguir ocultando las fechas.
⟦/IF⟧
⟦IF|a_c01_b⟧
Narración: Recibe una copia y al día siguiente no puede fingir que no sabía nada.
⟦/IF⟧
⟦IF|a_c01_c⟧
Narración: Ninguno recibe tu respuesta; conservas tú el original.
⟦/IF⟧
Narración: Revisar iconos de documentos tras el desayuno: Voltea cartas y empareja seis parejas de gala, con un máximo de ocho fallos. Puedes saltarlo.
⟦MG|g_mem_gala⟧
Narración: Faltan tres horas para la boda. Ethan te acerca un café como si anoche no hubiera pasado nada. Bajo el posavasos está la tarjeta de embarque de la mujer de dorado.
Ethan: “No conviertas un beso en una sentencia sobre todo nuestro matrimonio.”
Ethan: “¿La llamo ahora o me dices directamente si debemos detener la boda?”
⟦FREE⟧
Narración: Un camarero trae los votos. La portada lleva el nombre completo de tu empresa de diseño.

# SCENE｜Terraza de la finca
⟦BG|bg_a_c02s02|Terraza de la finca⟧
⟦TIME|07:25⟧
Narración: Un poco después — Terraza de la finca.
Narración: Damian espera en el viento frío con tu estuche del anillo. Sigue cerrado y contiene el antiguo tique de aparcamiento del hospital. Deja su abrigo sobre la baranda y se queda al frío, como esperando una sentencia largamente aplazada.
Damian: “Recuerdo que se te rompió el tacón y aun así insististe en llevar primero a la persona herida a urgencias.”
Damian: “¿Quieres que te acompañe a enfrentarte a Ethan o que mantenga la distancia?”
⟦FREE⟧
Narración: Coloca el estuche en la baranda de piedra y deja que decidas si recogerlo.

# SCENE｜Despacho de la organizadora
⟦BG|bg_a_c02s03|Despacho de la organizadora⟧
⟦TIME|07:50⟧
Narración: Un poco después — Despacho de la organizadora.
Narración: Concentrarte antes de ordenar registros de reproducción: Observa las cuatro luces de colores y repite la secuencia. Puedes saltarlo.
⟦MG|g_simon_lights⟧
Narración: La organizadora revisa en una tableta la proyección sorpresa de esta mañana. Una miniatura muestra la foto de la noche de lluvia de hace tres años. Ethan apaga la pantalla.
Ethan: “Era para que la vieras tú. No todo el mundo.”
Ethan: “¿Quieres que borre el material ahora o que llame a la organizadora para que testifique?”
⟦FREE⟧
Narración: La impresora expulsa automáticamente un anexo de autorización prematrimonial con tu nombre.
⟦SET|a_c02_event⟧

# CHOICE｜¿Qué haces antes de que empiece la ceremonia de hoy?
#### A｜Exigir a Ethan que elimine la proyección sorpresa
Narración: La organizadora sella ante ti la versión anterior de la lista de reproducción.
⟦OPT|A|set:a_c02_a⟧
#### B｜Entregar los documentos prematrimoniales a un abogado independiente
Narración: Los recibe antes de la ceremonia y puede señalar a tiempo el problema de autorización.
⟦OPT|B|set:a_c02_b⟧
#### C｜Negarte a seguir ensayando y avisar a una amiga
Narración: Se queda a tu lado y presencia la suspensión de los preparativos.
⟦OPT|C|set:a_c02_c⟧
# ·
Narración: ¿Aún quieres que la boda empiece según lo previsto?

# CHAPTER 3｜Silencio en el altar
⟦GOAL|Con el contrato al descubierto, ¿cómo detienes la boda?|Silencio en el altar⟧
⟦DONE|flag|a_c03_event|Observar el cambio clave|Narración: Tu teléfono no deja de sonar: tres proveedores del estudio exigen a la vez liquidar los anticipos.⟧
⟦DONE|say|Con el contrato al descubierto, ¿cómo detienes la boda? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Salón de bodas
⟦BG|bg_a_c03s01|Salón de bodas⟧
⟦TIME|10:00⟧
Narración: La mañana de la boda — Salón de bodas.
⟦IF|a_c02_a⟧
Narración: La organizadora sella ante ti la versión anterior de la lista de reproducción.
⟦/IF⟧
⟦IF|a_c02_b⟧
Narración: Los recibe antes de la ceremonia y puede señalar a tiempo el problema de autorización.
⟦/IF⟧
⟦IF|a_c02_c⟧
Narración: Se queda a tu lado y presencia la suspensión de los preparativos.
⟦/IF⟧
Narración: Preparar el archivo del material de ceremonia: Voltea cartas y empareja seis parejas de gala, con un máximo de ocho fallos. Puedes saltarlo.
⟦MG|g_mem_gala⟧
Narración: Los invitados se levantan y suenan las cuerdas, pero la pantalla gigante muestra antes de tiempo los diseños de una colaboración comercial. Son tus originales aún inéditos.
Ethan: “¿Por qué están esas imágenes ahí? ¡No autoricé esta proyección!”
Ethan: “¿Detienes la ceremonia ante todos o me dejas apagar primero la pantalla?”
⟦FREE⟧
Narración: Damian avanza desde la última fila y te pone delante un contrato voluminoso.
Narración: La tarea real es detener la proyección no consentida y preservar los registros.

# SCENE｜Sala lateral de la capilla
⟦BG|bg_a_c03s02|Sala lateral de la capilla⟧
⟦TIME|10:25⟧
Narración: Un poco después — Sala lateral de la capilla.
Narración: El contrato concede una licencia conjunta de diseño que entra en vigor el día de la boda, pero tu estudio no es el beneficiario. Damian permanece junto a la puerta sin excusarse. Mira tus labios un instante y se obliga a apartar los ojos. Bloquea las cámaras de los invitados, pero baja la mano cuando lo miras para que puedas salir por ti misma.
Damian: “Lo vi ayer. Debí contarte yo lo de esta página.”
Damian: “¿Lo reconozco públicamente ahora o entrego primero la página de firmas a tu abogado?”
⟦FREE⟧
Narración: Cuando Ethan entra tras de ti en la sala lateral, tu abogado confirma por teléfono que nunca firmaste esa licencia.

# SCENE｜Sala de reuniones
⟦BG|bg_a_c03s03|Sala de reuniones⟧
⟦TIME|10:50⟧
Narración: Un poco después — Sala de reuniones.
Narración: Ordenar notas de prensa antes de la reunión: Toca los iconos 📸 y evita 🙂; intenta acertar diez veces en veinte segundos. Puedes saltarlo.
⟦MG|g_whack_flash⟧
Narración: La ceremonia debe suspenderse. Ante los parientes de ambas familias, Eleanor anuncia la retención de los pagos de colaboración sin cambiar de sonrisa.
Eleanor: “Si no quieres formar parte de la familia, también habrá que reconsiderar los negocios.”
Eleanor: “¿Te explico el fundamento del bloqueo o dejamos que la prensa lo registre?”
⟦FREE⟧
Narración: Tu teléfono no deja de sonar: tres proveedores del estudio exigen a la vez liquidar los anticipos.
⟦SET|a_c03_event⟧

# CHOICE｜Con el contrato al descubierto, ¿cómo detienes la boda?
#### A｜Anunciar públicamente la suspensión y pedir una investigación
Narración: La prensa registra tu declaración formal; la familia no puede llamarlo una simple discusión.
⟦OPT|A|set:a_c03_a⟧
#### B｜Salir con los documentos e ir al abogado
Narración: Te llevas el anexo sin firmar y el abogado preserva la prueba allí mismo.
⟦OPT|B|set:a_c03_b⟧
#### C｜Exigir a Ethan que explique ante los invitados el origen de las imágenes
Narración: Su explicación queda grabada para contrastarla después con los registros del sistema.
⟦OPT|C|set:a_c03_c⟧
# ·
Narración: ¿Por qué tus diseños proyectados en la boda figuran en una autorización que nunca firmaste?

# CHAPTER 4｜Quién paga el precio
⟦GOAL|Con los pagos bloqueados, ¿qué proteges primero?|Quién paga el precio⟧
⟦DONE|flag|a_c04_event|Observar el cambio clave|Narración: Un periodista muestra otra captura recién recibida. La cuenta de origen pertenece al despacho de Eleanor.⟧
⟦DONE|say|Con los pagos bloqueados, ¿qué proteges primero? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Oficina provisional del estudio
⟦BG|bg_a_c04s01|Oficina provisional del estudio⟧
⟦TIME|15:30⟧
Narración: La tarde posterior a la suspensión — Oficina provisional del estudio.
⟦IF|a_c03_a⟧
Narración: La prensa registra tu declaración formal; la familia no puede llamarlo una simple discusión.
⟦/IF⟧
⟦IF|a_c03_b⟧
Narración: Te llevas el anexo sin firmar y el abogado preserva la prueba allí mismo.
⟦/IF⟧
⟦IF|a_c03_c⟧
Narración: Su explicación queda grabada para contrastarla después con los registros del sistema.
⟦/IF⟧
Narración: Concentrarte al ordenar contactos de clientes: Busca 💌 entre los iconos durante tres rondas. Puedes saltarlo.
⟦MG|g_find_letter⟧
Narración: Los bocetos de las prendas siguen en la pared desde la mañana. Tu ayudante llora ante el ordenador al comunicarte que el mayor cliente ha cancelado su pedido.
Mia: “Dicen que reanudarán los pagos si vuelves y terminas la boda.”
Mia: “¿Protegemos primero las nóminas o contactamos con los clientes para aclararlo públicamente?”
⟦FREE⟧
Narración: El correo de cancelación se envió cuarenta minutos antes del aviso de suspensión de la ceremonia.

# SCENE｜Bufete independiente
⟦BG|bg_a_c04s02|Bufete independiente⟧
⟦TIME|15:55⟧
Narración: Un poco después — Bufete independiente.
Narración: Damian extiende antiguas actas del consejo firmadas por él y acerca los justificantes de pago a tu abogado, no a ti. Añade su teléfono junto a la declaración, sin suplicarte que regreses.
Damian: “Pagaré los honorarios. No estoy comprando tu perdón.”
Damian: “¿Me quedo como testigo o espero fuera?”
⟦FREE⟧
Narración: El abogado señala una cifra: la familia había fijado el valor de tu estudio tres años antes.

# SCENE｜Zona de prensa del hotel
⟦BG|bg_a_c04s03|Zona de prensa del hotel⟧
⟦TIME|16:20⟧
Narración: Un poco después — Zona de prensa del hotel.
Narración: Preparar un índice de imágenes de prensa: Toca los iconos 📸 y evita 🙂; intenta acertar diez veces en veinte segundos. Puedes saltarlo.
⟦MG|g_whack_flash⟧
Narración: Los periodistas rodean una vieja foto filtrada y preguntan por tu relación con Damian. En la esquina superior derecha sigue la marca de agua del sistema de invitados de la boda.
Ethan: “No la fotografiéis. Esa foto salió de nuestro sistema.”
Ethan: “¿Quieres responder tú o exigirme que entregue todos los registros de acceso?”
⟦FREE⟧
Narración: Un periodista muestra otra captura recién recibida. La cuenta de origen pertenece al despacho de Eleanor.
⟦SET|a_c04_event⟧

# CHOICE｜Con los pagos bloqueados, ¿qué proteges primero?
#### A｜Proteger salarios y pedidos con el equipo
Narración: Los empleados reciben medidas de emergencia y saben que no son moneda de cambio.
⟦OPT|A|set:a_c04_a⟧
#### B｜Pedir al abogado la preservación inmediata de las pruebas
Narración: Los correos originales de colaboración quedan protegidos legalmente contra alteraciones.
⟦OPT|B|set:a_c04_b⟧
#### C｜Aclararlo personalmente a la prensa sin hablar de romances
Narración: Las noticias empiezan a tratar la posible infracción, además del escándalo familiar.
⟦OPT|C|set:a_c04_c⟧
# ·
Narración: ¿Quién convirtió vuestro pasado en un arma?

# CHAPTER 5｜La cena prohibida
⟦GOAL|¿Cómo respondes al beso que casi ocurrió en la terraza?|La cena prohibida⟧
⟦DONE|flag|a_c05_event|Observar el cambio clave|Narración: Un vehículo de seguridad familiar se aleja lentamente tras las ventanas del corredor.⟧
⟦DONE|say|¿Cómo respondes al beso que casi ocurrió en la terraza? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Comedor familiar
⟦BG|bg_a_c05s01|Comedor familiar⟧
⟦TIME|20:00⟧
Narración: El segundo día después de la boda — Comedor familiar.
⟦IF|a_c04_a⟧
Narración: Los empleados reciben medidas de emergencia y saben que no son moneda de cambio.
⟦/IF⟧
⟦IF|a_c04_b⟧
Narración: Los correos originales de colaboración quedan protegidos legalmente contra alteraciones.
⟦/IF⟧
⟦IF|a_c04_c⟧
Narración: Las noticias empiezan a tratar la posible infracción, además del escándalo familiar.
⟦/IF⟧
Narración: Reconocer iconos de la cena antes de sentarte: Voltea cartas y empareja seis parejas de gala, con un máximo de ocho fallos. Puedes saltarlo.
⟦MG|g_mem_gala⟧
Narración: Eleanor insiste en celebrar la cena y en que Ethan anuncie que solo habéis tenido una pequeña discusión. Damian deja la servilleta y se levanta. Ordena retirar la tarjeta de la cabecera que lo identifica como heredero y, por primera vez, se sienta a tu lado.
Damian: “Dejad de hablar por ella. No es un activo de esta mesa.”
Damian: “¿Quieres que vuelva a mi sitio o que lea el acuerdo prematrimonial en voz alta?”
⟦FREE⟧
Narración: La sala calla. Ethan aprieta su copa hasta agrietarla.

# SCENE｜Terraza nocturna
⟦BG|bg_a_c05s02|Terraza nocturna⟧
⟦TIME|20:25⟧
Narración: Un poco después — Terraza nocturna.
Narración: Cuelgas el abrigo en una silla. Damian no te toca; deja ante ti unos zapatos planos como los de aquella tormenta. Solo hay una copa entre vosotros. Su palma abierta descansa en la mesa, sin rozarte. Recuerda que no comías picante y que dijiste odiar que te trataran como un premio.
Damian: “Aquella noche diste tus zapatos a la chica herida y estuviste media hora descalza.”
Damian: “Si no me hubiera ido entonces, ¿querrías volver a conocerme?”
⟦FREE⟧
Narración: Ve un destello de cámara detrás de ti, pero no se esconde.

# SCENE｜Galería acristalada
⟦BG|bg_a_c05s03|Galería acristalada⟧
⟦TIME|20:50⟧
Narración: Un poco después — Galería acristalada.
Narración: Ordenar antes de guardar mensajes del corredor: Toca los iconos 📵 y evita 💬; intenta acertar diez veces en veinte segundos. Puedes saltarlo.
⟦MG|g_whack_texts⟧
Narración: Una cuenta anónima envía la foto recién tomada en la terraza y amenaza con publicar a medianoche que el hermano mayor ha robado a la novia. Damian intenta coger tu móvil y se detiene.
Damian: “Quiero besarte. Es verdad. Pero no quiero que pagues tú por mi deseo.”
Damian: “¿Respondemos al remitente anónimo o averiguamos primero quién nos fotografiaba desde abajo?”
⟦FREE⟧
Narración: Un vehículo de seguridad familiar se aleja lentamente tras las ventanas del corredor.
⟦SET|a_c05_event⟧

# CHOICE｜¿Cómo respondes al beso que casi ocurrió en la terraza?
#### A｜Conocer mejor a Damian, exigiendo la verdad
Narración: Promete entregar los antiguos votos; la intimidad no justifica ocultaciones.
⟦OPT|A|set:a_c05_a⟧
#### B｜Exigir primero el origen de la filtración
Narración: Detiene su gestión privada de prensa y ayuda a preservar las fotos furtivas.
⟦OPT|B|set:a_c05_b⟧
#### C｜No avanzar por ahora en la intimidad
Narración: Retira su acercamiento y respeta en adelante la distancia que pides.
⟦OPT|C|set:a_c05_c⟧
# ·
Narración: Entre sinceridad y escándalo, ¿en qué puedes confiar?

# CHAPTER 6｜Su voto decisivo
⟦GOAL|Tras ver el voto de Damian, ¿qué responsabilidad exiges?|Su voto decisivo⟧
⟦DONE|flag|a_c06_event|Observar el cambio clave|Narración: Te muestra una grabación de vigilancia sin sonido donde Damian está firmando.⟧
⟦DONE|say|Tras ver el voto de Damian, ¿qué responsabilidad exiges? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Archivo familiar
⟦BG|bg_a_c06s01|Archivo familiar⟧
⟦TIME|21:30⟧
Narración: El tercer día después de la boda — Archivo familiar.
⟦IF|a_c05_a⟧
Narración: Promete entregar los antiguos votos; la intimidad no justifica ocultaciones.
⟦/IF⟧
⟦IF|a_c05_b⟧
Narración: Detiene su gestión privada de prensa y ayuda a preservar las fotos furtivas.
⟦/IF⟧
⟦IF|a_c05_c⟧
Narración: Retira su acercamiento y respeta en adelante la distancia que pides.
⟦/IF⟧
Narración: Clasificar iconos antes de revisar los votos: Busca 💌 entre los iconos durante tres rondas. Puedes saltarlo.
⟦MG|g_find_letter⟧
Narración: Junto a la fotocopiadora hay un registro de votación del consejo de hace tres años: desde entonces se controlaría la colaboración de tu estudio. El voto decisivo fue el de Damian.
Abogado: “No pasó por alto el documento. Votó personalmente a favor.”
Abogado: “¿Quieres ver primero la grabación de la reunión o llamamos a Damian para que responda?”
⟦FREE⟧
Narración: En la puerta, Damian pierde por fin su habitual aplomo.

# SCENE｜Garaje subterráneo
⟦BG|bg_a_c06s02|Garaje subterráneo⟧
⟦TIME|21:55⟧
Narración: Un poco después — Garaje subterráneo.
Narración: Damian reconoce que el miedo a perder el control le impidió frenar el plan familiar de vincular tu proyecto al compromiso. La lluvia gotea de su caro abrigo. Le tiembla la mano al quitarse la insignia del consejo: una admisión más real que cualquier declaración de amor.
Damian: “Me gustaste aquella noche. Después fui yo quien te dejó entrar en esta trampa.”
Damian: “¿Quieres que dimita, que testifique o que no vuelva a buscarte después de esta noche?”
⟦FREE⟧
Narración: Deja la insignia a tu alcance sin decidir por ti.

# SCENE｜Entrada de la finca
⟦BG|bg_a_c06s03|Entrada de la finca⟧
⟦TIME|22:20⟧
Narración: Un poco después — Entrada de la finca.
Narración: Ordenar registros de viaje junto al acceso: Desliza las fichas junto al hueco y ordénalas del 1 al 8. Puedes saltarlo.
⟦MG|g_slide_photo⟧
Narración: Ethan se apoya en su coche con dos billetes hacia la ciudad prevista para vuestra luna de miel.
Ethan: “Mi hermano dirá que te quiere. A mí me interesa cuánto valía ese amor para él.”
Ethan: “¿Escucharás la otra mitad de lo que pasó hace tres años?”
⟦FREE⟧
Narración: Te muestra una grabación de vigilancia sin sonido donde Damian está firmando.
⟦SET|a_c06_event⟧

# CHOICE｜Tras ver el voto de Damian, ¿qué responsabilidad exiges?
#### A｜Pedirle que deje el cargo que supervisa tu estudio
Narración: Solicita apartarse ante el consejo y pierde el poder de intervenir directamente.
⟦OPT|A|set:a_c06_a⟧
#### B｜Hacer que admita públicamente el acuerdo económico de entonces
Narración: Su admisión escrita llega al abogado y permite verificar la votación.
⟦OPT|B|set:a_c06_b⟧
#### C｜Rechazar conversaciones privadas e investigar los viejos registros por tu cuenta
Narración: El abogado obtiene todo el material; Damian no puede seleccionar qué mostrarte.
⟦OPT|C|set:a_c06_c⟧
# ·
Narración: ¿Cuántas consecuencias siguen ocultas en aquel voto?

# CHAPTER 7｜Un nombre bajo la lluvia
⟦GOAL|Alguien accedió a la foto de lluvia. ¿Qué pista sigues primero?|Un nombre bajo la lluvia⟧
⟦DONE|flag|a_c07_event|Observar el cambio clave|Narración: En el monitor aparece fugazmente un pendiente de perla idéntico a los que suele llevar Eleanor.⟧
⟦DONE|say|Alguien accedió a la foto de lluvia. ¿Qué pista sigues primero? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Vestíbulo del antiguo hotel
⟦BG|bg_a_c07s01|Vestíbulo del antiguo hotel⟧
⟦TIME|14:00⟧
Narración: Un día más tarde — Vestíbulo del antiguo hotel.
⟦IF|a_c06_a⟧
Narración: Solicita apartarse ante el consejo y pierde el poder de intervenir directamente.
⟦/IF⟧
⟦IF|a_c06_b⟧
Narración: Su admisión escrita llega al abogado y permite verificar la votación.
⟦/IF⟧
⟦IF|a_c06_c⟧
Narración: El abogado obtiene todo el material; Damian no puede seleccionar qué mostrarte.
⟦/IF⟧
Narración: Preparar un índice para el registro del hotel: Voltea cartas y empareja seis parejas de recuerdos, con un máximo de ocho fallos. Puedes saltarlo.
⟦MG|g_mem_memory⟧
Narración: El viejo hotel conserva fotografías del rescate voluntario de aquel año. El responsable de recepción reconoce la foto de tu tacón roto.
Responsable de recepción: “Aquella noche cediste tu ambulancia a otra persona. Ese hombre te esperó hasta el amanecer.”
Responsable de recepción: “¿Consultas el registro de entonces o conoces primero al conductor rescatado?”
⟦FREE⟧
Narración: Del fondo de un armario saca un registro que alguien ya había fotocopiado.

# SCENE｜Escalera del hotel
⟦BG|bg_a_c07s02|Escalera del hotel⟧
⟦TIME|14:25⟧
Narración: Un poco después — Escalera del hotel.
Narración: Damian recuerda el sándwich frío compartido en los escalones y tu alias, June. Sonríe medio segundo al recordar la lluvia, luego se contiene al pensar en las decisiones que tomó después.
Damian: “Pensé en buscarte. Entonces vi las fotos de la pedida de Ethan.”
Damian: “¿Quieres saber por qué no aparecí o por qué ni siquiera te advertí?”
⟦FREE⟧
Narración: Su móvil recibe una petición de ayuda del archivero encargado de la vieja foto que fue retirada.

# SCENE｜Sala de vigilancia
⟦BG|bg_a_c07s03|Sala de vigilancia⟧
⟦TIME|14:50⟧
Narración: Un poco después — Sala de vigilancia.
Narración: Recordar el orden de revisión antes de entrar: Observa las cuatro luces de colores y repite la secuencia. Puedes saltarlo.
⟦MG|g_simon_lights⟧
Narración: El archivero muestra los registros: la foto se exportó una semana antes de la pedida de Ethan mediante la cuenta administrativa familiar.
Archivero: “Alguien os estaba asignando puestos a los tres desde el principio.”
Archivero: “¿Te llevas una copia de los registros o pedimos a la policía que preserve primero el disco duro original?”
⟦FREE⟧
Narración: En el monitor aparece fugazmente un pendiente de perla idéntico a los que suele llevar Eleanor.
Narración: La tarea real es contrastar la hora y el dispositivo de exportación de la foto.
⟦SET|a_c07_event⟧

# CHOICE｜Alguien accedió a la foto de lluvia. ¿Qué pista sigues primero?
#### A｜Conocer al conductor rescatado
Narración: Acepta testificar y aclara las circunstancias reales de tu encuentro con Damian.
⟦OPT|A|set:a_c07_a⟧
#### B｜Rastrear quién usó la cuenta administrativa familiar
Narración: El archivero preserva cuenta y dispositivos, conectando la cronología.
⟦OPT|B|set:a_c07_b⟧
#### C｜Exigir a Damian todos sus registros de contacto de entonces
Narración: Entrega datos de contacto nunca enviados y facturas del hotel; no bastan recuerdos románticos.
⟦OPT|C|set:a_c07_c⟧
# ·
Narración: ¿Quién empezó a registrar vuestras vidas tan pronto?

# CHAPTER 8｜La infidelidad era un montaje
⟦GOAL|Ethan admite que fingió la infidelidad. ¿Cómo actúas?|La infidelidad era un montaje⟧
⟦DONE|flag|a_c08_event|Observar el cambio clave|Narración: La ayudante de Eleanor entrega una amenaza: si sigues investigando, publicarán las fotos de la terraza.⟧
⟦DONE|say|Ethan admite que fingió la infidelidad. ¿Cómo actúas? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Estudio fotográfico privado
⟦BG|bg_a_c08s01|Estudio fotográfico privado⟧
⟦TIME|16:00⟧
Narración: El cuarto día — Estudio fotográfico privado.
⟦IF|a_c07_a⟧
Narración: Acepta testificar y aclara las circunstancias reales de tu encuentro con Damian.
⟦/IF⟧
⟦IF|a_c07_b⟧
Narración: El archivero preserva cuenta y dispositivos, conectando la cronología.
⟦/IF⟧
⟦IF|a_c07_c⟧
Narración: Entrega datos de contacto nunca enviados y facturas del hotel; no bastan recuerdos románticos.
⟦/IF⟧
Narración: Revisar iconos de rodaje en el plató: Busca 💌 entre los iconos durante tres rondas. Puedes saltarlo.
⟦MG|g_find_letter⟧
Narración: La mujer de dorado arroja sobre la mesa el contrato de rodaje: Ethan le pagó para fingir ser su amante. No parece satisfecha, sino enfadada.
Claire: “Creía que era un reality previo a la boda. Nadie me dijo que tú lo verías.”
Claire: “¿Quieres mi vídeo original o firmamos una declaración que me permita testificar públicamente?”
⟦FREE⟧
Narración: En la última página, junto a la firma de Ethan, hay otra de un organizador de la boda.

# SCENE｜Despacho de Ethan
⟦BG|bg_a_c08s02|Despacho de Ethan⟧
⟦TIME|16:25⟧
Narración: Un poco después — Despacho de Ethan.
Narración: Ethan admite por fin que el beso fue una puesta en escena. No dice que fuera por tu bien: te enseña las disculpas que escribió y borró una y otra vez. Intenta agarrarte la manga, ve tu expresión y finalmente te suelta.
Ethan: “Quería darte celos. Aposté a que me elegirías y perdí.”
Ethan: “¿Qué castigo sería justo? Al menos no me dejes volver a definir la justicia por ti.”
⟦FREE⟧
Narración: Abre un archivo cifrado con un fragmento de su hermano participando en el plan familiar.

# SCENE｜Sala de proyección
⟦BG|bg_a_c08s03|Sala de proyección⟧
⟦TIME|16:50⟧
Narración: Un poco después — Sala de proyección.
Narración: Ordenar números de material en la sala de proyección: Desliza las fichas junto al hueco y ordénalas del 1 al 8. Puedes saltarlo.
⟦MG|g_slide_photo⟧
Narración: El vídeo solo muestra el instante en que Damian votó a favor; lo anterior y lo posterior están cortados. Las propiedades del archivo indican que se modificó ayer.
Damian: “Firmé. Pero alguien borró mi oposición posterior.”
Damian: “¿Quieres comprobar el original completo o que lo lleve y responda a las preguntas?”
⟦FREE⟧
Narración: La ayudante de Eleanor entrega una amenaza: si sigues investigando, publicarán las fotos de la terraza.
⟦SET|a_c08_event⟧

# CHOICE｜Ethan admite que fingió la infidelidad. ¿Cómo actúas?
#### A｜Exigir que reconozca públicamente el montaje
Narración: Envía una rectificación a los organizadores; el escándalo ya no recae solo sobre ti.
⟦OPT|A|set:a_c08_a⟧
#### B｜Conservar el vídeo completo y sin editar que entrega
Narración: El abogado obtiene el original íntegro y no solo fragmentos contra Damian.
⟦OPT|B|set:a_c08_b⟧
#### C｜Rechazar que vuelva a acercarse provocando celos
Narración: Deja los mensajes de coqueteo y la conversación pasa a pruebas y responsabilidades.
⟦OPT|C|set:a_c08_c⟧
# ·
Narración: Si la infidelidad era teatro, ¿quién convirtió tu vida real en un negocio?

# CHAPTER 9｜El precio de un beso
⟦GOAL|¿Cómo respondes al chantaje sobre tu vida privada?|El precio de un beso⟧
⟦DONE|flag|a_c09_event|Observar el cambio clave|Narración: Un comentario anónimo advierte: «Las perlas recuerdan cada confesión».⟧
⟦DONE|say|¿Cómo respondes al chantaje sobre tu vida privada? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜estudio fotográfico
⟦BG|bg_a_c09s01|estudio fotográfico⟧
⟦TIME|11:00⟧
Narración: El quinto día — estudio fotográfico.
⟦IF|a_c08_a⟧
Narración: Envía una rectificación a los organizadores; el escándalo ya no recae solo sobre ti.
⟦/IF⟧
⟦IF|a_c08_b⟧
Narración: El abogado obtiene el original íntegro y no solo fragmentos contra Damian.
⟦/IF⟧
⟦IF|a_c08_c⟧
Narración: Deja los mensajes de coqueteo y la conversación pasa a pruebas y responsabilidades.
⟦/IF⟧
Narración: Preparar registros de contactos del estudio: Toca los iconos 📵 y evita 💬; intenta acertar diez veces en veinte segundos. Puedes saltarlo.
⟦MG|g_whack_texts⟧
Narración: La foto de la terraza aparece en internet con un titular que te acusa de huir de la boda por dinero. Tus compañeros ponen un maniquí ante la cámara para impedir fotos furtivas. La sonrisa de Ethan se derrumba: ve por primera vez el daño real de su juego.
Mia: “No están comentando con quién sales. Están destruyendo nuestros pedidos.”
Mia: “¿Quieres hablar tú o que el estudio publique primero solo los hechos sobre derechos de autor?”
⟦FREE⟧
Narración: Tu abogado llama: la cuenta anónima utiliza el servidor del sistema de la boda.
Narración: La tarea real es identificar el origen de publicación de la foto furtiva.

# SCENE｜Despacho de Damian
⟦BG|bg_a_c09s02|Despacho de Damian⟧
⟦TIME|11:25⟧
Narración: Un poco después — Despacho de Damian.
Narración: Damian prepara una orden a relaciones públicas para silenciar la noticia. Al verte entrar, cierra un correo sin enviar. Deja el teléfono en lugar de llamar por ti y espera tu propia propuesta.
Damian: “Otra vez quería resolverlo por ti. Casi repito el mismo error.”
Damian: “¿Quieres que haga público mi voto o que te devuelva las pruebas?”
⟦FREE⟧
Narración: Te entrega el documento original del consejo con sus anotaciones manuscritas, sin conservar copia.

# SCENE｜Estudio de emisión independiente
⟦BG|bg_a_c09s03|Estudio de emisión independiente⟧
⟦TIME|11:50⟧
Narración: Un poco después — Estudio de emisión independiente.
Narración: Reconocer iconos de cámara antes de emitir: Toca los iconos 📸 y evita 🙂; intenta acertar diez veces en veinte segundos. Puedes saltarlo.
⟦MG|g_whack_flash⟧
Narración: Te colocas ante el fondo vacío de la emisión. Las luces apuntan a la vieja foto utilizada contra ti. Ni Ethan ni Damian se sientan ante la cámara.
Periodista independiente: “Esta historia es tuya, no de los hermanos.”
Periodista independiente: “¿Aclaramos primero los rumores sentimentales o hablamos directamente con los documentos del estudio?”
⟦FREE⟧
Narración: Un comentario anónimo advierte: «Las perlas recuerdan cada confesión».
⟦SET|a_c09_event⟧

# CHOICE｜¿Cómo respondes al chantaje sobre tu vida privada?
#### A｜Publicar desde tu cuenta los hechos de la suspensión
Narración: Emites tú el comunicado y la prensa tiene una oportunidad menos de definir tu relación.
⟦OPT|A|set:a_c09_a⟧
#### B｜Demandar primero al filtrador y preservar el servidor
Narración: El abogado independiente protege las pruebas, dificultando que el anónimo las borre o cambie.
⟦OPT|B|set:a_c09_b⟧
#### C｜No revelar relaciones privadas y hablar solo de los derechos de tus obras
Narración: El equipo publica una declaración de titularidad; la intimidad deja de ser condición de negociación.
⟦OPT|C|set:a_c09_c⟧
# ·
Narración: ¿Por qué el anónimo tiene vigilancia interna?

# CHAPTER 10｜La rivalidad del hermano menor
⟦GOAL|Con los registros de acceso, ¿a quién responsabilizas primero?|La rivalidad del hermano menor⟧
⟦DONE|flag|a_c10_event|Observar el cambio clave|Narración: Te acerca una pila de contratos cuya portada lleva el nuevo nombre de tu estudio.⟧
⟦DONE|say|Con los registros de acceso, ¿a quién responsabilizas primero? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Sala de billar
⟦BG|bg_a_c10s01|Sala de billar⟧
⟦TIME|15:00⟧
Narración: El sexto día — Sala de billar.
⟦IF|a_c09_a⟧
Narración: Emites tú el comunicado y la prensa tiene una oportunidad menos de definir tu relación.
⟦/IF⟧
⟦IF|a_c09_b⟧
Narración: El abogado independiente protege las pruebas, dificultando que el anónimo las borre o cambie.
⟦/IF⟧
⟦IF|a_c09_c⟧
Narración: El equipo publica una declaración de titularidad; la intimidad deja de ser condición de negociación.
⟦/IF⟧
Narración: Indexar material de administrador en la sala de billar: Busca 💌 entre los iconos durante tres rondas. Puedes saltarlo.
⟦MG|g_find_letter⟧
Narración: Ethan sostiene el taco al revés, como un niño esperando un castigo. Dice que nunca aceptó vivir a la sombra de su hermano.
Ethan: “Te quise. También quería ganarle. Ambas cosas son verdad.”
Ethan: “¿Me escuchas hasta el final o te entrego primero la contraseña de la cuenta?”
⟦FREE⟧
Narración: Deja la credencial de administrador del sistema de invitados sobre la mesa de billar.

# SCENE｜Sala de control del sistema nupcial
⟦BG|bg_a_c10s02|Sala de control del sistema nupcial⟧
⟦TIME|15:25⟧
Narración: Un poco después — Sala de control del sistema nupcial.
Narración: Ethan abre todos los registros de acceso. Las grabaciones furtivas fueron subidas por la oficina administrativa familiar, disfrazadas de sorpresa de boda. Su broma se apaga en los labios; solo queda una disculpa tardía.
Administrador del sistema: “La orden de borrado no alcanzó la copia sin conexión. Aquí podemos recuperarla.”
Administrador del sistema: “¿La conservamos para tu abogado o hacemos que Ethan explique ahora su responsabilidad?”
⟦FREE⟧
Narración: El número del dispositivo de exportación señala el escritorio de la secretaria privada de Eleanor.
Narración: La tarea real es recuperar los registros del sistema de invitados.

# SCENE｜Salón de té de Eleanor
⟦BG|bg_a_c10s03|Salón de té de Eleanor⟧
⟦TIME|15:50⟧
Narración: Un poco después — Salón de té de Eleanor.
Narración: Practicar pasos de revisión antes de la reunión del té: Observa las cuatro luces de colores y repite la secuencia. Puedes saltarlo.
⟦MG|g_simon_lights⟧
Narración: Ethan interpela a su madre con la voz temblando. Eleanor solo remueve lentamente el té.
Eleanor: “Querías vencer a tu hermano y te ayudé. ¿Ahora me culpas?”
Eleanor: “¿Quieres mi definición del amor o prefieres ver las cuentas de vuestra empresa?”
⟦FREE⟧
Narración: Te acerca una pila de contratos cuya portada lleva el nuevo nombre de tu estudio.
⟦SET|a_c10_event⟧

# CHOICE｜Con los registros de acceso, ¿a quién responsabilizas primero?
#### A｜Exigir a Ethan una disculpa formal ante ti y el equipo
Narración: Su disculpa entra en el expediente y los empleados oyen admisiones concretas.
⟦OPT|A|set:a_c10_a⟧
#### B｜Encargar a una entidad independiente que contraste todos los registros de administrador
Narración: Los registros preservados muestran que el despacho de Eleanor subió el material furtivo.
⟦OPT|B|set:a_c10_b⟧
#### C｜Contrastar personalmente con Eleanor los registros de exportación
Narración: Su explicación queda registrada y no puede negar después que lo sabía.
⟦OPT|C|set:a_c10_c⟧
# ·
Narración: Los registros conducen a Eleanor. ¿Cuánto te ha quitado?

# CHAPTER 11｜El estudio que te arrebataron
⟦GOAL|Al descubrir la autorización falsa, ¿qué haces primero?|El estudio que te arrebataron⟧
⟦DONE|flag|a_c11_event|Observar el cambio clave|Narración: Un correo de un cliente de hace dos años revela que la familia te pidió dejar de buscar contactos externos.⟧
⟦DONE|say|Al descubrir la autorización falsa, ¿qué haces primero? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Archivador jurídico del estudio
⟦BG|bg_a_c11s01|Archivador jurídico del estudio⟧
⟦TIME|10:00⟧
Narración: El séptimo día — Archivador jurídico del estudio.
⟦IF|a_c10_a⟧
Narración: Su disculpa entra en el expediente y los empleados oyen admisiones concretas.
⟦/IF⟧
⟦IF|a_c10_b⟧
Narración: Los registros preservados muestran que el despacho de Eleanor subió el material furtivo.
⟦/IF⟧
⟦IF|a_c10_c⟧
Narración: Su explicación queda registrada y no puede negar después que lo sabía.
⟦/IF⟧
Narración: Practicar marcadores para documentos jurídicos: Busca 💌 entre los iconos durante tres rondas. Puedes saltarlo.
⟦MG|g_find_letter⟧
Narración: Encuentras una copia escaneada de una licencia permanente. La firma no es tuya. Sin embargo, abajo a la derecha lleva el antiguo sello que autorizaste para una sola prueba.
Abogado: “Han convertido una prueba breve en una cesión de propiedad mediante recortes.”
Abogado: “¿Solicitamos suspender el contrato primero o publicamos el registro completo de creación?”
⟦FREE⟧
Narración: Detrás de la copia figura el número de un proyecto del holding familiar.

# SCENE｜Despacho del consejo
⟦BG|bg_a_c11s02|Despacho del consejo⟧
⟦TIME|10:25⟧
Narración: Un poco después — Despacho del consejo.
Narración: Damian entrega la valoración secreta de tu empresa de hace tres años, con un precio dolorosamente bajo. Deja el original ante ti y te observa trabajar con admiración tardía, sin afán de posesión.
Damian: “Calculé el valor de la empresa. No calculé que eso destruiría a una persona.”
Damian: “¿Explico la valoración a tu equipo o la reconozco primero ante el tribunal?”
⟦FREE⟧
Narración: Sella la contraseña de autorización del consejo en la bolsa de pruebas del abogado, preparándose para dejar de acceder al proyecto.

# SCENE｜Mesas del estudio de madrugada
⟦BG|bg_a_c11s03|Mesas del estudio de madrugada⟧
⟦TIME|10:50⟧
Narración: Un poco después — Mesas del estudio de madrugada.
Narración: Ordenar antes de desplegar el material de diseño: Desliza las fichas junto al hueco y ordénalas del 1 al 8. Puedes saltarlo.
⟦MG|g_slide_photo⟧
Narración: Los diseñadores extienden originales, correos y muestras dibujadas a mano, uno tras otro. La pared se llena de fechas.
Mia: “No vendimos nuestro trabajo a nadie. Solo confiamos demasiado en ellos.”
Mia: “¿Empezamos por el primer boceto o buscamos primero la firma original?”
⟦FREE⟧
Narración: Un correo de un cliente de hace dos años revela que la familia te pidió dejar de buscar contactos externos.
⟦SET|a_c11_event⟧

# CHOICE｜Al descubrir la autorización falsa, ¿qué haces primero?
#### A｜Pedir al abogado que solicite detener el uso de tus diseños
Narración: Se exige que los productos familiares dejen de incorporar el material en disputa.
⟦OPT|A|set:a_c11_a⟧
#### B｜Reunir pruebas de creación con el equipo
Narración: Se fija la cronología de los originales y la plantilla participa en la reclamación real.
⟦OPT|B|set:a_c11_b⟧
#### C｜Exigir a Damian que revele la antigua valoración y su voto
Narración: Ambos pasan al expediente formal; ya no bastan promesas privadas.
⟦OPT|C|set:a_c11_c⟧
# ·
Narración: ¿Solo te robaron un proyecto?

# CHAPTER 12｜Tus propias pruebas
⟦GOAL|¿Cómo respondes al intercambio de matrimonio por acuerdo?|Tus propias pruebas⟧
⟦DONE|flag|a_c12_event|Observar el cambio clave|Narración: La ventana da al salón donde pronto se celebrará la junta de accionistas.⟧
⟦DONE|say|¿Cómo respondes al intercambio de matrimonio por acuerdo? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Archivo del estudio
⟦BG|bg_a_c12s01|Archivo del estudio⟧
⟦TIME|18:00⟧
Narración: El octavo día — Archivo del estudio.
⟦IF|a_c11_a⟧
Narración: Se exige que los productos familiares dejen de incorporar el material en disputa.
⟦/IF⟧
⟦IF|a_c11_b⟧
Narración: Se fija la cronología de los originales y la plantilla participa en la reclamación real.
⟦/IF⟧
⟦IF|a_c11_c⟧
Narración: Ambos pasan al expediente formal; ya no bastan promesas privadas.
⟦/IF⟧
Narración: Preparar un índice antes de contrastar fechas de la nube: Voltea cartas y empareja seis parejas de recuerdos, con un máximo de ocho fallos. Puedes saltarlo.
⟦MG|g_mem_memory⟧
Narración: Los registros originales de diseño coinciden con las horas de envío a la nube. La licencia falsificada no se sostiene técnicamente.
Abogado independiente: “Esta cadena basta para exigir explicaciones en una investigación formal.”
Abogado independiente: “¿Testifica toda la plantilla con nombre o la protegemos con declaraciones anónimas?”
⟦FREE⟧
Narración: El último testigo de la lista es el antiguo organizador de boda de Ethan.
Narración: La tarea real es verificar las fechas de creación de los archivos originales.

# SCENE｜Archivo de la empresa de bodas
⟦BG|bg_a_c12s02|Archivo de la empresa de bodas⟧
⟦TIME|18:25⟧
Narración: Un poco después — Archivo de la empresa de bodas.
Narración: Ethan entrega personalmente la copia sin conexión del sistema, que incluye su autorización del rodaje fingido. Damian aporta actas antiguas. Empieza a decir que te ayudará y rectifica: pregunta qué declaración necesitas de él.
Ethan: “Esto demuestra lo estúpido que fui. No volveré a borrarlo.”
Ethan: “¿Lo presenta todo tu abogado o explicamos cada uno nuestra parte por separado?”
⟦FREE⟧
Narración: Un correo de la copia propone intercambiar matrimonio por retirada del caso.

# SCENE｜Suite privada de Eleanor
⟦BG|bg_a_c12s03|Suite privada de Eleanor⟧
⟦TIME|18:50⟧
Narración: Un poco después — Suite privada de Eleanor.
Narración: Ordenar cláusulas antes de la reunión en la suite: Busca 💌 entre los iconos durante tres rondas. Puedes saltarlo.
⟦MG|g_find_letter⟧
Narración: Eleanor coloca un acuerdo junto al champán: si vuelves a la boda y firmas una autorización adicional, retirará su demanda. Mantiene el dedo sobre el papel como si el matrimonio fuera un contrato que pudiera volver a tasarse.
Eleanor: “Quieres amor, respetabilidad y empresa. ¿Quién consigue las tres cosas?”
Eleanor: “¿Explico aquí cada cláusula o dejamos que tu abogado las fotografíe?”
⟦FREE⟧
Narración: La ventana da al salón donde pronto se celebrará la junta de accionistas.
⟦SET|a_c12_event⟧

# CHOICE｜¿Cómo respondes al intercambio de matrimonio por acuerdo?
#### A｜Rechazarlo de inmediato y conservar el documento
Narración: Se convierte en prueba de que ella vincula matrimonio y propiedad.
⟦OPT|A|set:a_c12_a⟧
#### B｜Exigir negociación formal únicamente mediante abogados
Narración: La presión privada deja de ser una condición y todas las cláusulas quedan registradas.
⟦OPT|B|set:a_c12_b⟧
#### C｜Incluir a empleados y diseñadores en la decisión
Narración: El equipo emite una postura conjunta y ya no pueden empujarte sola de vuelta a la boda.
⟦OPT|C|set:a_c12_c⟧
# ·
Narración: ¿Qué original podría hundir a Eleanor para que quiera cambiar matrimonio por retirada del caso?

# CHAPTER 13｜El hombre que renuncia a la corona
⟦GOAL|¿Cómo valoras la dimisión pública de Damian?|El hombre que renuncia a la corona⟧
⟦DONE|flag|a_c13_event|Observar el cambio clave|Narración: Eleanor se levanta y saca la grabación de vigilancia de la noche de lluvia que escondió durante tres años.⟧
⟦DONE|say|¿Cómo valoras la dimisión pública de Damian? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Sala de accionistas
⟦BG|bg_a_c13s01|Sala de accionistas⟧
⟦TIME|11:00⟧
Narración: El noveno día — Sala de accionistas.
⟦IF|a_c12_a⟧
Narración: Se convierte en prueba de que ella vincula matrimonio y propiedad.
⟦/IF⟧
⟦IF|a_c12_b⟧
Narración: La presión privada deja de ser una condición y todas las cláusulas quedan registradas.
⟦/IF⟧
⟦IF|a_c12_c⟧
Narración: El equipo emite una postura conjunta y ya no pueden empujarte sola de vuelta a la boda.
⟦/IF⟧
Narración: Reconocer iconos del recinto antes de la junta: Voltea cartas y empareja seis parejas de gala, con un máximo de ocho fallos. Puedes saltarlo.
⟦MG|g_mem_gala⟧
Narración: Damian se acerca al micrófono, reconoce públicamente su voto favorable y renuncia al puesto del consejo responsable de tu proyecto.
Damian: “Para ganar convertí su nombre en moneda de cambio.”
Damian: “¿Sigo nombrando a quienes estaban detrás o respondo primero a los accionistas?”
⟦FREE⟧
Narración: El recuento proyectado cambia de inmediato. Eleanor levanta la voz por primera vez.

# SCENE｜Galería de accionistas
⟦BG|bg_a_c13s02|Galería de accionistas⟧
⟦TIME|11:25⟧
Narración: Un poco después — Galería de accionistas.
Narración: Ethan reconoce públicamente las fotos fingidas, las grabaciones furtivas y la manipulación de la boda sin mirar a su hermano. Damian te busca entre la gente y solo asiente levemente cuando confirma que lo ves.
Ethan: “Esta vez no discutiré quién la quiere más. Solo diré lo que hice.”
Ethan: “¿Entrego todos los archivos originales o elimino antes tu nombre de mi declaración?”
⟦FREE⟧
Narración: El equipo jurídico custodia ambas declaraciones por separado, sin saldar la responsabilidad de ninguno.

# SCENE｜Tribuna
⟦BG|bg_a_c13s03|Tribuna⟧
⟦TIME|11:50⟧
Narración: Un poco después — Tribuna.
Narración: Practicar el orden del material antes de presentar: Desliza las fichas junto al hueco y ordénalas del 1 al 8. Puedes saltarlo.
⟦MG|g_slide_photo⟧
Narración: Tú y el equipo mostráis los primeros originales y las fechas completas de desarrollo. Los consejeros independientes solicitan una investigación.
Consejero independiente: “Conservad los originales. Necesitamos pruebas que permitan llegar hasta el final.”
Consejero independiente: “¿Publicas todo el proceso de diseño o presentas solo lo necesario para acreditar la titularidad?”
⟦FREE⟧
Narración: Eleanor se levanta y saca la grabación de vigilancia de la noche de lluvia que escondió durante tres años.
⟦SET|a_c13_event⟧

# CHOICE｜¿Cómo valoras la dimisión pública de Damian?
#### A｜Reconocer que responsabilidad y cambio son distintos
Narración: Entiende que dimitir es solo el principio y no exige afecto a cambio.
⟦OPT|A|set:a_c13_a⟧
#### B｜Exigir que siga compareciendo y relate todos los hechos
Narración: Entrega testimonio público que hace avanzar la investigación.
⟦OPT|B|set:a_c13_b⟧
#### C｜Devolver la atención a tu propia obra
Narración: La prensa muestra tus originales en lugar de centrarse solo en los celos de los hermanos.
⟦OPT|C|set:a_c13_c⟧
# ·
Narración: Si él lo pierde todo, ¿eso hará que lo ames?

# CHAPTER 14｜La jugada de la matriarca
⟦GOAL|¿Cómo utilizas la vieja grabación de Eleanor?|La jugada de la matriarca⟧
⟦DONE|flag|a_c14_event|Observar el cambio clave|Narración: Retiran las luces de boda del jardín y aparecen por primera vez las ramas sin adornos.⟧
⟦DONE|say|¿Cómo utilizas la vieja grabación de Eleanor? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Despacho de Eleanor
⟦BG|bg_a_c14s01|Despacho de Eleanor⟧
⟦TIME|20:00⟧
Narración: El décimo día — Despacho de Eleanor.
⟦IF|a_c13_a⟧
Narración: Entiende que dimitir es solo el principio y no exige afecto a cambio.
⟦/IF⟧
⟦IF|a_c13_b⟧
Narración: Entrega testimonio público que hace avanzar la investigación.
⟦/IF⟧
⟦IF|a_c13_c⟧
Narración: La prensa muestra tus originales en lugar de centrarse solo en los celos de los hermanos.
⟦/IF⟧
Narración: Concentrarte antes de ver la grabación antigua: Observa las cuatro luces de colores y repite la secuencia. Puedes saltarlo.
⟦MG|g_simon_lights⟧
Narración: Eleanor reproduce la vieja grabación para insinuar tratos indebidos entre Damian y tú. También muestra que esperaste hasta el amanecer fuera de urgencias.
Eleanor: “Si dejas de perseguir esto, aún puede quedar en familia.”
Eleanor: “¿Quieres que todos vean el vídeo entero o que el tribunal lo custodie bajo reserva?”
⟦FREE⟧
Narración: Tu abogado descubre veinte segundos cortados deliberadamente al final del archivo.
Narración: La tarea real es comparar la parte recortada de la vieja grabación.

# SCENE｜Sala de consultas jurídicas
⟦BG|bg_a_c14s02|Sala de consultas jurídicas⟧
⟦TIME|20:25⟧
Narración: Un poco después — Sala de consultas jurídicas.
Narración: La carta amenazante de Eleanor llega formalmente. Damian decide presentar su declaración, incluido que no detuvo la infracción entonces. Antes de firmar no te mira, como si entendiera por fin que responsabilizarse no exige público.
Damian: “Asumiré mi parte. No la cambiaré por un agradecimiento.”
Damian: “¿Quieres entrar conmigo o que solo coincidamos a través de las declaraciones?”
⟦FREE⟧
Narración: Una secretaria llama y entrega los movimientos de fondos del montaje, firmados por Ethan.

# SCENE｜Pasadizo del jardín
⟦BG|bg_a_c14s03|Pasadizo del jardín⟧
⟦TIME|20:50⟧
Narración: Un poco después — Pasadizo del jardín.
Narración: Ordenar contactos antes de cruzar el jardín: Toca los iconos 📵 y evita 💬; intenta acertar diez veces en veinte segundos. Puedes saltarlo.
⟦MG|g_whack_texts⟧
Narración: Ethan mete en una bolsa transparente todas las pruebas de su participación en los rumores. Su firma se ve claramente.
Ethan: “Haber perdido tu amor no me da derecho a excusarme.”
Ethan: “¿Quieres mi última explicación o que me marche en silencio?”
⟦FREE⟧
Narración: Retiran las luces de boda del jardín y aparecen por primera vez las ramas sin adornos.
⟦SET|a_c14_event⟧

# CHOICE｜¿Cómo utilizas la vieja grabación de Eleanor?
#### A｜Exigir la conservación íntegra del vídeo sin recortes
Narración: Los veinte segundos ausentes pasan a ser una cuestión probatoria pendiente.
⟦OPT|A|set:a_c14_a⟧
#### B｜Rechazar en persona el intercambio de retirada del caso por matrimonio
Narración: Su último trato privado fracasa.
⟦OPT|B|set:a_c14_b⟧
#### C｜Hacer que Ethan y Damian declaren por separado
Narración: Sus testimonios independientes quedan fijados; no pueden echarse la culpa mutuamente.
⟦OPT|C|set:a_c14_c⟧
# ·
Narración: ¿Qué nuevos hechos revelarán los veinte segundos que faltan?

# CHAPTER 15｜Nadie responde por ti
⟦GOAL|Con la verdad empezando a aclararse, ¿qué reconstruyes primero?|Nadie responde por ti⟧
⟦DONE|flag|a_c15_event|Observar el cambio clave|Narración: Suena el teléfono del estudio: por fin un cliente que de verdad quiere comprar tus diseños.⟧
⟦DONE|say|Con la verdad empezando a aclararse, ¿qué reconstruyes primero? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Sala de revisión independiente
⟦BG|bg_a_c15s01|Sala de revisión independiente⟧
⟦TIME|17:00⟧
Narración: Una semana después — Sala de revisión independiente.
⟦IF|a_c14_a⟧
Narración: Los veinte segundos ausentes pasan a ser una cuestión probatoria pendiente.
⟦/IF⟧
⟦IF|a_c14_b⟧
Narración: Su último trato privado fracasa.
⟦/IF⟧
⟦IF|a_c14_c⟧
Narración: Sus testimonios independientes quedan fijados; no pueden echarse la culpa mutuamente.
⟦/IF⟧
Narración: Practicar con iconos antes de revisar renovaciones: Busca 💌 entre los iconos durante tres rondas. Puedes saltarlo.
⟦MG|g_find_letter⟧
Narración: La investigación preliminar relaciona la autorización falsa y el bloqueo de pagos, pero el procedimiento judicial aún necesita tiempo. Recibes una carta de intención para renovar contratos del estudio.
Abogado independiente: “Hemos recuperado capacidad de negociar. Eso no significa que lo demás termine solo.”
Abogado independiente: “¿Quieres reconstruir el negocio primero o reservar fuerzas para el litigio?”
⟦FREE⟧
Narración: El correo incluye las firmas de empleados que deciden volver a quedarse.

# SCENE｜Cafetería junto al río
⟦BG|bg_a_c15s02|Cafetería junto al río⟧
⟦TIME|17:25⟧
Narración: Un poco después — Cafetería junto al río.
Narración: Damian se quita la cara chaqueta y se sienta sencillamente frente a ti, por primera vez sin escoltas ni relaciones públicas. Junto al café no hay flores ni anillo, solo una nota que dice que podéis ir despacio.
Damian: “Si quieres, podemos empezar de nuevo por nuestros nombres. También puedes negarte.”
Damian: “¿Termino de contarte el pasado o empezamos por cómo te ha ido hoy?”
⟦FREE⟧
Narración: Ethan envía una disculpa que no exige respuesta y no vuelve a ponerse en contacto.

# SCENE｜Jardín nupcial vacío
⟦BG|bg_a_c15s03|Jardín nupcial vacío⟧
⟦TIME|17:50⟧
Narración: Un poco después — Jardín nupcial vacío.
Narración: Indexar objetos en el antiguo jardín de boda: Voltea cartas y empareja seis parejas de recuerdos, con un máximo de ocho fallos. Puedes saltarlo.
⟦MG|g_mem_memory⟧
Narración: Los operarios retiran la última fila de sillas blancas. El estuche que sostienes sigue cerrado; nadie lo lleva por ti. El viento da la vuelta a la última tarjeta de sitio de la mesa.
Narración: “¿Guardarás el anillo como prueba, lo devolverás o lo apartarás por ahora?”
⟦FREE⟧
Narración: Suena el teléfono del estudio: por fin un cliente que de verdad quiere comprar tus diseños.
⟦SET|a_c15_event⟧

# CHOICE｜Con la verdad empezando a aclararse, ¿qué reconstruyes primero?
#### A｜Dar prioridad a volver a dirigir el estudio
Narración: Tú y el equipo firmáis vuestro primer pedido nuevo independiente.
⟦OPT|A|set:a_c15_a⟧
#### B｜Permitir a Damian conocerte de nuevo en público
Narración: Recibe una reunión en igualdad, sin promesa romántica.
⟦OPT|B|set:a_c15_b⟧
#### C｜Suspender el contacto privado con ambos hermanos
Narración: Respetan tu decisión y tu vida sigue siendo completa.
⟦OPT|C|set:a_c15_c⟧
# ·
Narración: ¿Qué intimidad deseas de verdad?

# CHAPTER 16｜La vida después de la boda
⟦GOAL|¿Qué relación eliges para la siguiente página?|La vida después de la boda⟧
⟦DONE|flag|a_c16_event|Observar el cambio clave|Narración: El río refleja dos sombras que pueden acercarse o separarse.⟧
⟦DONE|say|¿Qué relación eliges para la siguiente página? Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.|Expresar tu intención|Narración: Puedes preguntar, acercarte, negarte o aplazar; expresar condiciones o pedir ayuda para verificar.⟧

# SCENE｜Exposición del nuevo estudio
⟦BG|bg_a_c16s01|Exposición del nuevo estudio⟧
⟦TIME|19:00⟧
Narración: Seis meses después — Exposición del nuevo estudio.
⟦IF|a_c15_a⟧
Narración: Tú y el equipo firmáis vuestro primer pedido nuevo independiente.
⟦/IF⟧
⟦IF|a_c15_b⟧
Narración: Recibe una reunión en igualdad, sin promesa romántica.
⟦/IF⟧
⟦IF|a_c15_c⟧
Narración: Respetan tu decisión y tu vida sigue siendo completa.
⟦/IF⟧
Narración: Revisar el catálogo de imágenes antes de abrir: Desliza las fichas junto al hueco y ordénalas del 1 al 8. Puedes saltarlo.
⟦MG|g_slide_photo⟧
Narración: Seis meses después, tu nombre preside la entrada de tu exposición de originales. Los antiguos bocetos se muestran en vitrinas.
Mia: “Esta vez hemos leído nosotros todos los contratos.”
Mia: “¿Recibes primero a los invitados o miras esa carta todavía cerrada?”
⟦FREE⟧
Narración: Damian figura en la lista de visitas con cita, pero no ha entrado sin permiso.

# SCENE｜Salón de la exposición
⟦BG|bg_a_c16s02|Salón de la exposición⟧
⟦TIME|19:25⟧
Narración: Un poco después — Salón de la exposición.
Narración: Damian trae un cuaderno en blanco como el de hace tres años. La disculpa de Ethan llega a través del abogado, sin exigir una reunión. Damian sostiene el cuaderno sin tenderte la mano y espera que decidas si esta página lo incluye.
Damian: “No sé adónde llegaremos. Solo sé que no quiero volver a organizar tu vida por ti.”
Damian: “¿Puedo quedarme a tomar café o prefieres que hoy sea solo un visitante más?”
⟦FREE⟧
Narración: Fuera de la sala alguien pregunta cómo se llamará tu próxima exposición.

# SCENE｜Paseo junto al río
⟦BG|bg_a_c16s03|Paseo junto al río⟧
⟦TIME|19:50⟧
Narración: Un poco después — Paseo junto al río.
Narración: Ordenar las notas de hoy antes del paseo: Busca 💌 entre los iconos durante tres rondas. Puedes saltarlo.
⟦MG|g_find_letter⟧
Narración: El viento nocturno levanta tu bufanda. Las luces lejanas de la ciudad siguen brillando. Tu vida ya no la define una boda.
Damian: “Si quieres, podemos empezar por un paseo sin mentiras.”
Damian: “¿Con quién quieres seguir adelante o prefieres acompañarte solo a ti esta vez?”
⟦FREE⟧
Narración: El río refleja dos sombras que pueden acercarse o separarse.
⟦SET|a_c16_event⟧

# CHOICE｜¿Qué relación eliges para la siguiente página?
#### A｜Expresar que quieres empezar con una cita en igualdad con Damian
Narración: Solo tu deseo explícito permite una primera cita formal; los procedimientos de responsabilidad continúan.
⟦OPT|A|set:a_c16_a⟧
#### B｜Dejar abierta una reconstrucción gradual con Ethan si sigue cambiando
Narración: Solo puede volver a conocerte desde la honestidad y el respeto de los límites.
⟦OPT|B|set:a_c16_b⟧
#### C｜Elegir soltería, libertad o aplazar cualquier compromiso romántico
Narración: Recuperas tu tiempo y la historia termina con independencia y límites completos.
⟦OPT|C|set:a_c16_c⟧
# ·
Narración: Esta vez, la siguiente página de tu vida la escribes tú.
