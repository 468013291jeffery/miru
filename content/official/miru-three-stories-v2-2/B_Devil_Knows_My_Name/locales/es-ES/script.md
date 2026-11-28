# CHAPTER 1｜La orden de muerte
⟦GOAL|Tu nombre está en la lista de recompensas. ¿Qué haces primero?|La orden de muerte⟧
⟦DONE|flag|b_c01_event|Presenciar el cambio clave|Narración: La pantalla de emergencia se ilumina. Tu nombre encabeza la lista de recompensas y el comprador figura como «Roman Moretti».⟧
⟦DONE|say|Expresa cómo abordar «Tu nombre está en la lista de recompensas. ¿Qué haces primero?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Club subterráneo
⟦BG|bg_b_c01s01|Club subterráneo⟧
⟦TIME|02:00⟧
Narración: Esa misma noche llegas al club privado subterráneo. Los bajos hacen vibrar las copas. Golpeas la mesa con la orden de detención firmada por Roman; la banda se detiene al instante. La penumbra acentúa su vieja cicatriz sobre la ceja izquierda, pero ni siquiera se pone a la defensiva.
Roman: «La firma es mía. La orden de matar a tu hermano no. ¿Quieres que lo admita ante todos o ver primero el original?»
⟦FREE⟧
Narración: Aparta la pistola de la mesa, dejando claro que nada se interpone entre vosotros.

# SCENE｜Despacho privado del club
⟦BG|bg_b_c01s02|Despacho privado del club⟧
⟦TIME|02:25⟧
Narración: Después, en la sala privada del club, Roman abre un cajón cerrado con llave. Hay tres versiones de la orden operativa; solo una lleva el sello rojo letal. Su mano izquierda casi toca la foto que has dejado, pero se retira para que puedas recogerla primero.
Narración: Antes de comparar las tres órdenes, afina la vista: busca 💌 entre los iconos de papel.
⟦MG|g_find_letter⟧
Roman: «Firmé para traerlo de vuelta. Después alguien convirtió el interrogatorio en ejecución. ¿Te digo quién recibió el documento o explico primero por qué quemé los registros posteriores?»
⟦FREE⟧
Narración: Se enciende la alarma y resuenan pasos apresurados en el pasillo.

# SCENE｜Escalera de emergencia
⟦BG|bg_b_c01s03|Escalera de emergencia⟧
⟦TIME|02:50⟧
Narración: Después, en la escalera de emergencia del club, se apagan todas las luces. Roman deposita la llave de salida en tu mano y se queda junto a la puerta atendiendo una llamada cifrada.
Narración: La escalera está oscura. Antes de seguir, practica buscando 🗝 entre los objetos.
⟦MG|g_find_key⟧
Roman: «Este camino lleva a la calle. No me debes ninguna razón para seguirme. ¿Te vas, escuchas la llamada o compruebas primero quién compró la recompensa?»
⟦FREE⟧
Narración: La pantalla de emergencia se ilumina. Tu nombre encabeza la lista de recompensas y el comprador figura como «Roman Moretti».
⟦SET|b_c01_event⟧

# CHOICE｜Tu nombre está en la lista de recompensas. ¿Qué haces primero?
#### A｜Fotografiar la lista y salir del territorio de Roman
Narración: La lista queda fotografiada y el abogado independiente recibe una copia.
⟦OPT|A|set:b_c01_a⟧
#### B｜Exigir que explique allí mismo por qué compró tu recompensa
Narración: Admite comprarla para impedir otros contratos y deja pruebas que permiten más preguntas.
⟦OPT|B|set:b_c01_b⟧
#### C｜Quedarte a verificar la orden original, rechazando la protección organizada
Narración: Entrega el original; las decisiones sobre tu seguridad siguen siendo tuyas.
⟦OPT|C|set:b_c01_c⟧
# ·
Narración: ¿Quién puso primero tu nombre en la lista?

# CHAPTER 2｜El hombre al otro lado de tu puerta
⟦GOAL|Recibes el disco de tu hermano. ¿Cómo lo verificarás?|El hombre al otro lado de tu puerta⟧
⟦DONE|flag|b_c02_event|Presenciar el cambio clave|Narración: Por fin deja ante la puerta una foto chamuscada de un almacén, sin pedirte que abras.⟧
⟦DONE|say|Expresa cómo abordar «Recibes el disco de tu hermano. ¿Cómo lo verificarás?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Bufete independiente
⟦BG|bg_b_c02s01|Bufete independiente⟧
⟦TIME|22:00⟧
⟦IF|b_c01_a⟧
Narración: La lista queda fotografiada y el abogado independiente recibe una copia.
⟦/IF⟧
⟦IF|b_c01_b⟧
Narración: Admite comprarla para impedir otros contratos y deja pruebas que permiten más preguntas.
⟦/IF⟧
⟦IF|b_c01_c⟧
Narración: Entrega el original; las decisiones sobre tu seguridad siguen siendo tuyas.
⟦/IF⟧
Narración: La noche siguiente, en la sala del abogado independiente, el abogado de Roman ofrece tres viviendas seguras para que elijas en el mapa. Roman permanece junto a la ventana, sin sentarse a tu lado.
Narración: El mapa está abierto. Ordena las fichas 🗺 si quieres una pausa antes de elegir vivienda.
⟦MG|g_slide_map⟧
Abogado independiente: «Puedes contactar conmigo directamente, sin pasar por él. ¿Prefieres ir primero a un lugar seguro o exigir una investigación pública de la recompensa?»
⟦FREE⟧
Narración: El abogado deja una tarjeta telefónica independiente e instrucciones sobre las salidas de emergencia.

# SCENE｜Salón del apartamento
⟦BG|bg_b_c02s02|Salón del apartamento⟧
⟦TIME|22:25⟧
Narración: Después, en el salón del piso seguro, deslizan bajo la puerta la funda de un disco antiguo: el jazz que tu hermano Luca ponía cada cumpleaños. En el cierre hay un código infantil escrito a mano. Al otro lado, Roman deja café en el suelo; el detalle aumenta tus ganas de preguntar cómo conoce tus costumbres.
Narración: No hace falta tocar la funda aún. Mientras se organiza el examen, busca 💌 entre los papeles.
⟦MG|g_find_letter⟧
Nadia: «No confíes demasiado pronto en un recuerdo. Primero comprobemos cómo llegó. ¿Buscamos huellas, escuchamos el disco o enseñamos la letra a un viejo amigo de tu hermano?»
⟦FREE⟧
Narración: El disco lleva un código de mensajería que empezó a utilizarse hace solo tres semanas.

# SCENE｜Pasillo del apartamento
⟦BG|bg_b_c02s03|Pasillo del apartamento⟧
⟦TIME|22:50⟧
Narración: Después, en el pasillo exterior del piso, Roman está sentado al otro extremo. Tiene el abrigo en el respaldo y un botiquín sin abrir a su lado.
Roman: «Sé cosas que tu hermano no te contó. Yo también oculté cosas. ¿Quieres que me vaya o que escriba primero lo que sé?»
⟦FREE⟧
Narración: Por fin deja ante la puerta una foto chamuscada de un almacén, sin pedirte que abras.
⟦SET|b_c02_event⟧

# CHOICE｜Recibes el disco de tu hermano. ¿Cómo lo verificarás?
#### A｜Pedir a Nadia una identificación independiente de su origen
Narración: El registro de envío y el código infantil se contrastan y aportan una nueva pista.
⟦OPT|A|set:b_c02_a⟧
#### B｜Exigir que Roman escriba los secretos de tu hermano que conoce
Narración: Deja una declaración escrita, con un registro verificable de su versión.
⟦OPT|B|set:b_c02_b⟧
#### C｜Salir primero del piso seguro para evitar el rastreo
Narración: El abogado actualiza tu domicilio; el equipo de Roman ya no puede conocerlo.
⟦OPT|C|set:b_c02_c⟧
# ·
Narración: ¿Esta preocupación es protección o vigilancia?

# CHAPTER 3｜¿Detención o asesinato?
⟦GOAL|Sabes que Roman quemó pruebas. ¿Qué preguntas primero?|¿Detención o asesinato?⟧
⟦DONE|flag|b_c03_event|Presenciar el cambio clave|Narración: Se recupera un breve fragmento: «No te fíes de aquel funeral».⟧
⟦DONE|say|Expresa cómo abordar «Sabes que Roman quemó pruebas. ¿Qué preguntas primero?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Centro de archivos
⟦BG|bg_b_c03s01|Centro de archivos⟧
⟦TIME|11:00⟧
⟦IF|b_c02_a⟧
Narración: El registro de envío y el código infantil se contrastan y aportan una nueva pista.
⟦/IF⟧
⟦IF|b_c02_b⟧
Narración: Deja una declaración escrita, con un registro verificable de su versión.
⟦/IF⟧
⟦IF|b_c02_c⟧
Narración: El abogado actualiza tu domicilio; el equipo de Roman ya no puede conocerlo.
⟦/IF⟧
Narración: La tercera mañana, en el archivo, Nadia levanta con guantes la orden original. El sello rojo es posterior a la firma de Roman; la tinta y las fibras del papel no coinciden.
Narración: El peritaje lleva tiempo. Mientras esperas, empareja seis parejas de cámaras, carretes y otros iconos.
⟦MG|g_mem_memory⟧
Nadia: «No se hicieron el mismo día. Alguien dio una nueva orden después de él. ¿Quieres un peritaje primero o llevarle la versión falsificada a Roman?»
⟦FREE⟧
Narración: La lámpara pericial revela un número de archivero raspado. La tarea inmediata es comparar el color de tinta de los dos sellos de la orden.

# SCENE｜Despacho del club cerrado
⟦BG|bg_b_c03s02|Despacho del club cerrado⟧
⟦TIME|11:25⟧
Narración: Después, en la oficina cerrada del club, Roman no se esconde. Admite que quemó las grabaciones originales tras la operación porque el libro implicaba sus propios negocios. Cierra un momento los ojos al oír el nombre de tu hermano, como si por fin alguien nombrara su culpa.
Roman: «El sello asesino no era mío. El fuego que ocultó pruebas sí. ¿Grabas mi declaración o entrego primero el disco duro superviviente?»
⟦FREE⟧
Narración: Se quita el reloj y descubre quemaduras de unas semanas antes.

# SCENE｜Cuarto oscuro de fotografía
⟦BG|bg_b_c03s03|Cuarto oscuro de fotografía⟧
⟦TIME|11:50⟧
Narración: Después, en el cuarto oscuro del estudio fotográfico, recuperas la última llamada de Luca. Marcó tu número, pero la copia de la compañía telefónica muestra que la llamada fue desviada.
Narración: Mientras recuperan la copia telefónica, concéntrate pulsando las luces en el orden mostrado.
⟦MG|g_simon_lights⟧
Nadia: «No dejaste de contestar. Alguien impidió que sonara. ¿Comprobamos la antena o vemos a quien desvió la llamada?»
⟦FREE⟧
Narración: Se recupera un breve fragmento: «No te fíes de aquel funeral».
⟦SET|b_c03_event⟧

# CHOICE｜Sabes que Roman quemó pruebas. ¿Qué preguntas primero?
#### A｜Exigir el nombre de quien tocó la orden por última vez
Narración: Entrega el nombre y los registros de traspaso; no basta con negar el asesinato.
⟦OPT|A|set:b_c03_a⟧
#### B｜Priorizar el rastreo de la última llamada desviada
Narración: Los registros telefónicos se conservan y apuntan a una central de conmutación.
⟦OPT|B|set:b_c03_b⟧
#### C｜Rechazar nuevas reuniones privadas con él
Narración: Solo puede entregar materiales mediante el abogado, sin preparar encuentros privados «casuales».
⟦OPT|C|set:b_c03_c⟧
# ·
Narración: ¿Qué dijo tu hermano el día que desviaron la llamada?

# CHAPTER 4｜Solo un baile
⟦GOAL|Alguien te llama públicamente su mujer. ¿Cómo respondes?|Solo un baile⟧
⟦DONE|flag|b_c04_event|Presenciar el cambio clave|Narración: Roman murmura una fecha grabada dentro del anillo, sin explicar por qué la recuerda.⟧
⟦DONE|say|Expresa cómo abordar «Alguien te llama públicamente su mujer. ¿Cómo respondes?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Pista de baile a medianoche
⟦BG|bg_b_c04s01|Pista de baile a medianoche⟧
⟦TIME|23:00⟧
⟦IF|b_c03_a⟧
Narración: Entrega el nombre y los registros de traspaso; no basta con negar el asesinato.
⟦/IF⟧
⟦IF|b_c03_b⟧
Narración: Los registros telefónicos se conservan y apuntan a una central de conmutación.
⟦/IF⟧
⟦IF|b_c03_c⟧
Narración: Solo puede entregar materiales mediante el abogado, sin preparar encuentros privados «casuales».
⟦/IF⟧
Narración: La cuarta noche, en la pista del club a medianoche, un cliente te llama «la nueva favorita de Moretti» y atrae las miradas. Roman se acerca, pero se detiene a un brazo de distancia. La luz roja se oscurece y su mano espera junto a tu cintura; no te tocará sin permiso.
Roman: «Un baile podría callarlos. Si no bailas, también puedo resolverlo. ¿Quieres bailar o que los corrija públicamente?»
⟦FREE⟧
Narración: Un camarero pasa y oculta una nota doblada bajo tu posavasos.

# SCENE｜Reservado rojo
⟦BG|bg_b_c04s02|Reservado rojo⟧
⟦TIME|23:25⟧
Narración: Después, en el reservado rojo junto a la pista, la nota reproduce las marcas interiores del viejo anillo de tu hermano. Los dedos de Roman se detienen un segundo al reconocerlas. Pese a la música cercana, solo tú oyes: «Que quiera acercarme no te obliga a quedarte».
Narración: Deja la nota a salvo. Si quieres una pausa, busca 💌 antes de preguntar por su origen.
⟦MG|g_find_letter⟧
Roman: «Siempre le gustó apostar. Solo decía la verdad al perder. ¿Te cuento de dónde salió el anillo o preguntas tú a quien mandó la nota?»
⟦FREE⟧
Narración: Nadia aparece detrás de la cortina y señala un lugar tranquilo. La tarea inmediata es reconstruir el código infantil del reverso del anillo.

# SCENE｜Pasillo entre bastidores
⟦BG|bg_b_c04s03|Pasillo entre bastidores⟧
⟦TIME|23:50⟧
Narración: Después, en el pasillo tras el escenario, la música aún vibra en la pared. Nadia muestra una vieja fotografía de acceso al muelle: alguien sale llevando el anillo de Luca.
Narración: La foto sigue a mano. Ordena las fichas 📷 antes de volver a comprobar la fecha.
⟦MG|g_slide_photo⟧
Nadia: «La fecha es cuatro días posterior a su muerte notificada. ¿Quieres que Roman lo compruebe o llevarte la foto para investigar por tu cuenta?»
⟦FREE⟧
Narración: Roman murmura una fecha grabada dentro del anillo, sin explicar por qué la recuerda.
⟦SET|b_c04_event⟧

# CHOICE｜Alguien te llama públicamente su mujer. ¿Cómo respondes?
#### A｜Elegir bailar con Roman y aprovechar para preguntar
Narración: Controlas la conversación ante todos y consigues la nota.
⟦OPT|A|set:b_c04_a⟧
#### B｜Exigir que corrija inmediatamente esa expresión
Narración: La corrige públicamente y todos saben que no perteneces a nadie.
⟦OPT|B|set:b_c04_b⟧
#### C｜Rechazar el baile e investigar la nota con Nadia
Narración: Nadia conserva el origen de la nota; el baile no sucede.
⟦OPT|C|set:b_c04_c⟧
# ·
Narración: ¿Pueden coexistir ternura y culpa en una misma persona?

# CHAPTER 5｜Él también sangra
⟦GOAL|Roman está herido y aparece un llavero. ¿Cómo actúas?|Él también sangra⟧
⟦DONE|flag|b_c05_event|Presenciar el cambio clave|Narración: El tatuaje de su muñeca coincide con un dibujo que tu hermano hacía de niño.⟧
⟦DONE|say|Expresa cómo abordar «Roman está herido y aparece un llavero. ¿Cómo actúas?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Zona médica del garaje
⟦BG|bg_b_c05s01|Zona médica del garaje⟧
⟦TIME|03:00⟧
⟦IF|b_c04_a⟧
Narración: Controlas la conversación ante todos y consigues la nota.
⟦/IF⟧
⟦IF|b_c04_b⟧
Narración: La corrige públicamente y todos saben que no perteneces a nadie.
⟦/IF⟧
⟦IF|b_c04_c⟧
Narración: Nadia conserva el origen de la nota; el baile no sucede.
⟦/IF⟧
Narración: Al amanecer del quinto día, en el rincón médico del garaje subterráneo, Roman protege de un ataque a un conductor que iba a testificar; la sangre empapa su hombro. Comprueba primero que el conductor esté a salvo y luego se sienta. Sangra entre los dedos, pero sigue comprobando si el herido respira.
Narración: Deja espacio al personal médico. Mientras prepara todo, puedes buscar 🗝 entre los objetos.
⟦MG|g_find_key⟧
Roman: «No pares lo que necesitas hacer por mí. ¿Me pasas el botiquín o dejas que se encargue el médico?»
⟦FREE⟧
Narración: Del botiquín cae un llavero metálico con el nombre de Luca.

# SCENE｜Clínica provisional
⟦BG|bg_b_c05s02|Clínica provisional⟧
⟦TIME|03:25⟧
Narración: Después, en la consulta provisional, el médico cose la herida de Roman. Él no finge fortaleza: mira el llavero antiguo y baja la voz. El dolor le altera la respiración, pero aún teme que dejes de preguntar porque está sangrando.
Roman: «Me lo dio él. Pensé que no volvería a verlo. ¿Quieres saber su historia o prefieres que calle de momento?»
⟦FREE⟧
Narración: La fecha de registro de la prueba médica es tres semanas posterior al informe policial de fallecimiento.

# SCENE｜Oficina del aparcamiento
⟦BG|bg_b_c05s03|Oficina del aparcamiento⟧
⟦TIME|03:50⟧
Narración: Después, en la oficina de vigilancia del aparcamiento, Nadia recupera un escaneo de entrada de pruebas: alguien entregó personalmente el llavero al hospital después de la «muerte» de Luca.
Narración: La entrada de pruebas espera verificación. Haz una pausa emparejando cámaras, carretes y otros iconos.
⟦MG|g_mem_memory⟧
Nadia: «Lo trajeron. No lo retiraron de un cadáver. ¿Buscamos al mensajero o revisamos primero las cámaras del hospital de ese día?»
⟦FREE⟧
Narración: El tatuaje de su muñeca coincide con un dibujo que tu hermano hacía de niño. La tarea inmediata es verificar la hora de registro de entrada del llavero.
⟦SET|b_c05_event⟧

# CHOICE｜Roman está herido y aparece un llavero. ¿Cómo actúas?
#### A｜Ayudar al médico sin aceptar intimidad
Narración: Termina la cura y Roman entiende que ayudar a un paciente no es absolverlo.
⟦OPT|A|set:b_c05_a⟧
#### B｜Mantener distancia y priorizar el rastreo del llavero
Narración: El hospital conserva los registros y el llavero pasa a peritaje independiente.
⟦OPT|B|set:b_c05_b⟧
#### C｜Irte ya y encargar a Nadia que obtenga las pruebas
Narración: Puedes salir del entorno de Roman; Nadia completa la investigación de forma independiente.
⟦OPT|C|set:b_c05_c⟧
# ·
Narración: ¿Cómo aparecieron las pertenencias de tu hermano después de su muerte?

# CHAPTER 6｜El expediente privado
⟦GOAL|Descubres que Roman vigilaba tu vida. ¿Qué exiges?|El expediente privado⟧
⟦DONE|flag|b_c06_event|Presenciar el cambio clave|Narración: Las esquinas del papel indican un viejo acuario abandonado.⟧
⟦DONE|say|Expresa cómo abordar «Descubres que Roman vigilaba tu vida. ¿Qué exiges?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Despacho de Roman
⟦BG|bg_b_c06s01|Despacho de Roman⟧
⟦TIME|14:00⟧
⟦IF|b_c05_a⟧
Narración: Termina la cura y Roman entiende que ayudar a un paciente no es absolverlo.
⟦/IF⟧
⟦IF|b_c05_b⟧
Narración: El hospital conserva los registros y el llavero pasa a peritaje independiente.
⟦/IF⟧
⟦IF|b_c05_c⟧
Narración: Puedes salir del entorno de Roman; Nadia completa la investigación de forma independiente.
⟦/IF⟧
Narración: La sexta tarde, en el estudio privado de Roman, una pared tras la estantería contiene tus fotos de entrevistas públicas, horarios y direcciones de trabajo. Hay incluso una foto enmarcada de un piso antiguo que nunca le mencionaste.
Narración: No hay prisa por desmontar marcos. Ordena las fichas 📷 mientras esperas al abogado.
⟦MG|g_slide_photo⟧
Roman: «Mis hombres te vigilaron. Yo lo autoricé. No hay excusa. ¿Quieres destruirlo, conservarlo como prueba o llamar ya al abogado?»
⟦FREE⟧
Narración: Mete todos los dispositivos en bolsas transparentes de pruebas y retrocede dos pasos.

# SCENE｜Almacén del despacho
⟦BG|bg_b_c06s02|Almacén del despacho⟧
⟦TIME|14:25⟧
Narración: Después, en el almacén del estudio, Roman revoca sus accesos ante el abogado y entrega las cuentas de respaldo sin exigir confianza. No defiende la pared de fotos ni intenta retenerte mientras retiras los materiales.
Abogado independiente: «Tú controlarás cómo se usan estos registros como prueba. ¿Protegemos primero tu dirección o verificamos cuándo empezó la vigilancia?»
⟦FREE⟧
Narración: La fotografía más antigua es anterior al inicio de tu investigación sobre la muerte de tu hermano.

# SCENE｜Cafetería independiente
⟦BG|bg_b_c06s03|Cafetería independiente⟧
⟦TIME|14:50⟧
Narración: Después, en la cafetería independiente de abajo, das la vuelta a una foto y ves el código infantil de tu hermano. Nadia verifica la letra: Luca pudo utilizar los archivos de Roman para dejarte un mensaje.
Narración: La letra aún debe verificarse. Empareja los iconos y vuelve después al reverso de la foto.
⟦MG|g_mem_memory⟧
Nadia: «Alguien dejó pistas a través de sus ojos. ¿Quién da más miedo ahora? ¿Desciframos el código o apartamos primero a Roman por completo de la investigación?»
⟦FREE⟧
Narración: Las esquinas del papel indican un viejo acuario abandonado.
⟦SET|b_c06_event⟧

# CHOICE｜Descubres que Roman vigilaba tu vida. ¿Qué exiges?
#### A｜Borrar de inmediato los datos privados y precintar las pruebas
Narración: Entrega todos los accesos y cesa la vigilancia ilegal.
⟦OPT|A|set:b_c06_a⟧
#### B｜Pedir al abogado independiente que exija responsabilidades
Narración: Los registros entran en una investigación formal; una disculpa privada no sustituye la responsabilidad.
⟦OPT|B|set:b_c06_b⟧
#### C｜Cortar el contacto personal con Roman
Narración: Deja de contactarte directamente y solo entrega materiales mediante el abogado.
⟦OPT|C|set:b_c06_c⟧
# ·
Narración: La vigilancia empezó antes de conocerlo. ¿Quién te buscó primero?

# CHAPTER 7｜Un hermano que sigue vivo
⟦GOAL|Tu hermano podría vivir. ¿Cómo organizarás la cita?|Un hermano que sigue vivo⟧
⟦DONE|flag|b_c07_event|Presenciar el cambio clave|Narración: Al final queda una frase cortada: «No le des el disco duro a Roman».⟧
⟦DONE|say|Expresa cómo abordar «Tu hermano podría vivir. ¿Cómo organizarás la cita?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Archivo de la estación suburbana
⟦BG|bg_b_c07s01|Archivo de la estación suburbana⟧
⟦TIME|16:00⟧
⟦IF|b_c06_a⟧
Narración: Entrega todos los accesos y cesa la vigilancia ilegal.
⟦/IF⟧
⟦IF|b_c06_b⟧
Narración: Los registros entran en una investigación formal; una disculpa privada no sustituye la responsabilidad.
⟦/IF⟧
⟦IF|b_c06_c⟧
Narración: Deja de contactarte directamente y solo entrega materiales mediante el abogado.
⟦/IF⟧
Narración: Al atardecer del séptimo día, en la sala de vigilancia de la estación suburbana, Nadia consigue imágenes de hace un mes. Un hombre con abrigo oscuro se quita el sombrero y muestra la vieja cicatriz de Luca en la ceja.
Narración: La grabación está pausada. Ordena las fichas 📷 si necesitas respirar antes de mirar la cara.
⟦MG|g_slide_photo⟧
Nadia: «Está vivo. Solo puedo asegurar eso; lo demás necesita verificación. ¿Comprobamos su identidad, vamos a la estación o avisamos a Roman?»
⟦FREE⟧
Narración: Suena tu móvil. Un número desconocido envía un audio con un secreto infantil que solo conocíais los dos hermanos.

# SCENE｜Bufete independiente
⟦BG|bg_b_c07s02|Bufete independiente⟧
⟦TIME|16:25⟧
Narración: Después, en el despacho del abogado independiente, Roman guarda un largo silencio tras escuchar el audio. Admite que acaba de conocer las imágenes, sin fingir que ya lo sabía para conservar el control. También pierde la calma al oír a tu hermano, pero solo te acerca una silla, sin quitarte la grabación.
Roman: «Si está vivo, te debo una explicación aún peor. ¿Quieres mi ayuda para encontrarlo o que mis hombres se retiren por completo?»
⟦FREE⟧
Narración: El abogado te entrega el mapa del acuario y rutas seguras.

# SCENE｜Sala de análisis de audio
⟦BG|bg_b_c07s03|Sala de análisis de audio⟧
⟦TIME|16:50⟧
Narración: Después, en el laboratorio de audio, Nadia y tú comparáis minuciosamente la nueva grabación con antiguos vídeos de tu hermano. Un anuncio de metro de fondo confirma que fue grabada hace dos días.
Narración: Mientras se contrasta el audio por partes, repite la secuencia de luces de la pantalla.
⟦MG|g_simon_lights⟧
Nadia: «La voz es auténtica. Aunque viva, te debe una explicación por tres meses de duelo. ¿Quieres ir a solas o tener cerca al abogado independiente?»
⟦FREE⟧
Narración: Al final queda una frase cortada: «No le des el disco duro a Roman». La tarea inmediata es comparar las grabaciones nuevas y antiguas de tu hermano.
⟦SET|b_c07_event⟧

# CHOICE｜Tu hermano podría vivir. ¿Cómo organizarás la cita?
#### A｜Ir al acuario con el abogado independiente
Narración: Se confirman rutas seguras y un testigo; Luca no puede monopolizar fácilmente el relato.
⟦OPT|A|set:b_c07_a⟧
#### B｜Reservar una conversación privada con contacto de emergencia
Narración: Puedes hablar a solas con Luca y tener ayuda independiente de Roman.
⟦OPT|B|set:b_c07_b⟧
#### C｜Exigir verificar voz e identidad antes de verlo
Narración: Se organiza el peritaje y disminuye el riesgo de una identidad falsa.
⟦OPT|C|set:b_c07_c⟧
# ·
Narración: ¿Por qué tu hermano prefirió que lloraras su muerte?

# CHAPTER 8｜Media verdad en el acuario
⟦GOAL|Luca te pide ocultar el disco. ¿Cómo respondes?|Media verdad en el acuario⟧
⟦DONE|flag|b_c08_event|Presenciar el cambio clave|Narración: Al fondo de la taquilla hay otra nota con tu nombre y una hora de reunión.⟧
⟦DONE|say|Expresa cómo abordar «Luca te pide ocultar el disco. ¿Cómo respondes?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Taquilla del acuario abandonado
⟦BG|bg_b_c08s01|Taquilla del acuario abandonado⟧
⟦TIME|19:00⟧
⟦IF|b_c07_a⟧
Narración: Se confirman rutas seguras y un testigo; Luca no puede monopolizar fácilmente el relato.
⟦/IF⟧
⟦IF|b_c07_b⟧
Narración: Puedes hablar a solas con Luca y tener ayuda independiente de Roman.
⟦/IF⟧
⟦IF|b_c07_c⟧
Narración: Se organiza el peritaje y disminuye el riesgo de una identidad falsa.
⟦/IF⟧
Narración: La séptima noche, en la taquilla del acuario viejo, una ficha metálica que intercambiasteis de niños sale por debajo de la ventana y cae al suelo. Tras el cristal grueso, una silueta familiar espera al fondo de la piscina.
Narración: Deja la ficha cerca. Antes de elegir tu pregunta, empareja cámaras, juguetes y otros iconos.
⟦MG|g_mem_memory⟧
Luca: «No dejes entrar a Roman. Al menos esta vez, escúchame primero. ¿Quieres preguntar por qué fingí morir o comprobar primero que soy Luca?»
⟦FREE⟧
Narración: La luz azul del agua ilumina su cara. Tus tres meses de duelo encuentran de pronto un destinatario vivo.

# SCENE｜Pasillo acristalado del acuario
⟦BG|bg_b_c08s02|Pasillo acristalado del acuario⟧
⟦TIME|19:25⟧
Narración: Después, en el corredor acristalado del acuario abandonado, Luca se acerca con una cicatriz nueva. Intenta abrazarte, pero se detiene. Roman espera en la salida, sin avanzar como antes: aprende a guardar su ansiedad en sus propios ojos.
Luca: «Lo siento. Nunca pude decirlo mientras estaba vivo. ¿Necesitas un abrazo, una explicación o que me aleje primero?»
⟦FREE⟧
Narración: La sombra de un tiburón de maqueta cruza el cristal agrietado. Luca evita contar cómo escapó.

# SCENE｜Almacén del acuario
⟦BG|bg_b_c08s03|Almacén del acuario⟧
⟦TIME|19:50⟧
Narración: Después, en el almacén del acuario, Luca saca un disco negro que, según él, contiene todas las cuentas criminales de Roman, pero no permite conectarlo allí al ordenador.
Narración: Deja el disco desconectado. Mientras se registra la entrega, busca 💌 entre los papeles.
⟦MG|g_find_letter⟧
Luca: «No me fío de él. Tú tampoco deberías. ¿Quieres preguntar por qué te pido esconderlo en vez de dárselo a un investigador independiente? Debo explicarlo.»
⟦FREE⟧
Narración: Al fondo de la taquilla hay otra nota con tu nombre y una hora de reunión.
⟦SET|b_c08_event⟧

# CHOICE｜Luca te pide ocultar el disco. ¿Cómo respondes?
#### A｜Negarte a ocultarlo y pedir custodia externa
Narración: El disco entra en custodia independiente y no puede ser el arma de ninguno.
⟦OPT|A|set:b_c08_a⟧
#### B｜Guardarlo temporalmente, precintando una copia y registrando los tiempos
Narración: Quedan pruebas del origen y la entrega; el parentesco ya no basta.
⟦OPT|B|set:b_c08_b⟧
#### C｜Exigir primero que explique cómo sobrevivió
Narración: Admite haber organizado la falsa muerte y su versión queda registrada.
⟦OPT|C|set:b_c08_c⟧
# ·
Narración: Tu hermano vuelve vivo. ¿Por qué sigue pidiéndote que escondas el disco?

# CHAPTER 9｜Un plan oculto tras el deseo
⟦GOAL|Roman admite que al principio te utilizó. ¿Cómo respondes?|Un plan oculto tras el deseo⟧
⟦DONE|flag|b_c09_event|Presenciar el cambio clave|Narración: Un mensajero ciclista trae la contraseña del disco de Luca: el nombre de vuestro perro de la infancia.⟧
⟦DONE|say|Expresa cómo abordar «Roman admite que al principio te utilizó. ¿Cómo respondes?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Salida del acuario
⟦BG|bg_b_c09s01|Salida del acuario⟧
⟦TIME|21:00⟧
⟦IF|b_c08_a⟧
Narración: El disco entra en custodia independiente y no puede ser el arma de ninguno.
⟦/IF⟧
⟦IF|b_c08_b⟧
Narración: Quedan pruebas del origen y la entrega; el parentesco ya no basta.
⟦/IF⟧
⟦IF|b_c08_c⟧
Narración: Admite haber organizado la falsa muerte y su versión queda registrada.
⟦/IF⟧
Narración: La octava noche, en la salida del acuario, Roman espera fuera como prometió, aunque pide al conductor que ilumine la salida. Luca grita desde atrás que no subas al coche. Roman traga saliva; por primera vez no conserva las apariencias mediante el silencio.
Narración: La salida está iluminada; no tienes que subir ya. Ordena las fichas 🗺 y elige tu camino.
⟦MG|g_slide_map⟧
Roman: «No preguntaré qué habéis hablado. Tienes tu propio camino. ¿Me voy, te contacto con el abogado o entrego mis registros operativos?»
⟦FREE⟧
Narración: A lo lejos Luca desaparece por un callejón. Ya no lleva el disco en la mano.

# SCENE｜Bar de jazz vacío
⟦BG|bg_b_c09s02|Bar de jazz vacío⟧
⟦TIME|21:25⟧
Narración: Después, en un bar de jazz vacío, Roman propone una reunión sin sus hombres. Solo hay agua y documentos operativos en la mesa. Dice por primera vez «Te he echado de menos» y enseguida entrega al abogado todos los planes para acercarse a ti.
Roman: «Al principio me acerqué para encontrar a Luca y el libro. Después mis sentimientos fueron reales. ¿Qué parte te hace querer irte más? Puedes decirlo directamente».
⟦FREE⟧
Narración: Entrega su teléfono cifrado al abogado. Todos los planes de acercamiento se detienen en el acto.

# SCENE｜Marquesina bajo la lluvia
⟦BG|bg_b_c09s03|Marquesina bajo la lluvia⟧
⟦TIME|21:50⟧
Narración: Después, bajo el toldo de la puerta trasera, Roman recibe una llamada urgente de sus hombres. Ante ti rechaza seguir vigilándote «por tu protección».
Narración: Tras la llamada, practica ordenar avisos: pulsa 📵, evita 💬 y retoma cómo comunicaros.
⟦MG|g_whack_texts⟧
Roman: «Quiero que te quedes. Pero es mi deseo, no tu obligación. ¿Cortamos el contacto o intercambiamos pruebas solo por medio del abogado?»
⟦FREE⟧
Narración: Un mensajero ciclista trae la contraseña del disco de Luca: el nombre de vuestro perro de la infancia.
⟦SET|b_c09_event⟧

# CHOICE｜Roman admite que al principio te utilizó. ¿Cómo respondes?
#### A｜Exigir que detenga todo acercamiento privado
Narración: Revoca todos los planes de contacto y no habrá reuniones privadas a corto plazo.
⟦OPT|A|set:b_c09_a⟧
#### B｜Permitir el intercambio de pruebas mediante abogados
Narración: Continúa la cooperación necesaria, pero la intimidad queda en pausa.
⟦OPT|B|set:b_c09_b⟧
#### C｜Escuchar su explicación sin creerle de inmediato
Narración: Entrega los documentos operativos completos al abogado; la confianza deberá demostrarse después.
⟦OPT|C|set:b_c09_c⟧
# ·
Narración: ¿Cómo juzgarás cuando conviven mentiras y sentimientos reales?

# CHAPTER 10｜Fuera de su sombra
⟦GOAL|Alguien vigila tu nueva dirección. ¿En qué confías primero?|Fuera de su sombra⟧
⟦DONE|flag|b_c10_event|Presenciar el cambio clave|Narración: Fuera, una furgoneta de reparto vuelve a doblar la esquina. Su matrícula no tiene relación con Roman.⟧
⟦DONE|say|Expresa cómo abordar «Alguien vigila tu nueva dirección. ¿En qué confías primero?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Laboratorio de datos independiente
⟦BG|bg_b_c10s01|Laboratorio de datos independiente⟧
⟦TIME|08:30⟧
⟦IF|b_c09_a⟧
Narración: Revoca todos los planes de contacto y no habrá reuniones privadas a corto plazo.
⟦/IF⟧
⟦IF|b_c09_b⟧
Narración: Continúa la cooperación necesaria, pero la intimidad queda en pausa.
⟦/IF⟧
⟦IF|b_c09_c⟧
Narración: Entrega los documentos operativos completos al abogado; la confianza deberá demostrarse después.
⟦/IF⟧
Narración: La novena mañana, en un laboratorio independiente de datos, Nadia abre el disco. Roman se opuso varias veces por escrito a negocios ilegales de trata dentro de la organización, pero terminó tolerando la red de blanqueo.
Narración: Tras cargar los archivos, respira: observa las luces y repite la secuencia.
⟦MG|g_simon_lights⟧
Nadia: «No es inocente. Tampoco todas las acusaciones son ciertas. ¿Clasificamos las pruebas por delito o buscamos primero a quien alteró la orden de detención?»
⟦FREE⟧
Narración: La imagen se congela en la mano de Roman firmando una advertencia escrita.

# SCENE｜Entrada del nuevo apartamento
⟦BG|bg_b_c10s02|Entrada del nuevo apartamento⟧
⟦TIME|08:55⟧
Narración: Después, ante tu piso nuevo, has pagado el alquiler con tu dinero y encargado las cerraduras a una empresa independiente. Solo hay café en grano fuera, sin cámaras ni escoltas. La nota de Roman menciona tu café habitual, sin pedir respuesta.
Narración: Deja el paquete junto a la puerta. Antes de registrarlo, busca 💌 si quieres un momento para pensar.
⟦MG|g_find_letter⟧
Administrador: «El paquete va dirigido a ti, pero no dejaron teléfono. ¿Lo aceptas, lo devolvemos o lo registro yo?»
⟦FREE⟧
Narración: Dentro del envoltorio hay una nota: «Hoy no vayas por tu calle habitual».

# SCENE｜Mesita junto a la ventana
⟦BG|bg_b_c10s03|Mesita junto a la ventana⟧
⟦TIME|09:20⟧
Narración: Después, junto a la pequeña mesa de la ventana, la disculpa de Roman tiene solo tres frases y ninguna excusa. Termina ofreciendo entregar a los reguladores los registros de vigilancia.
Nadia: «Puedes leer una disculpa. No tienes que decidir hoy si perdonas. ¿Guardas la carta o la precintamos junto al expediente?»
⟦FREE⟧
Narración: Fuera, una furgoneta de reparto vuelve a doblar la esquina. Su matrícula no tiene relación con Roman.
⟦SET|b_c10_event⟧

# CHOICE｜Alguien vigila tu nueva dirección. ¿En qué confías primero?
#### A｜Protegerte y denunciar la matrícula desconocida
Narración: Policía y abogado conservan los datos del vehículo y verifican el riesgo independientemente.
⟦OPT|A|set:b_c10_a⟧
#### B｜Exigir al equipo de Roman que explique el envío
Narración: Entregan los registros de reparto; la preocupación no los exime de preguntas.
⟦OPT|B|set:b_c10_b⟧
#### C｜Preguntar a Luca si filtró tu dirección
Narración: Su respuesta evasiva queda registrada; ser tu hermano no lo exime de verificación.
⟦OPT|C|set:b_c10_c⟧
# ·
Narración: ¿Por qué la lista de Luca dice que llevarás el libro?

# CHAPTER 11｜Tu hermano te usó como cebo
⟦GOAL|Tu hermano admite que te usó de cebo. ¿Qué harás?|Tu hermano te usó como cebo⟧
⟦DONE|flag|b_c11_event|Presenciar el cambio clave|Narración: Admite que sabía que podían poner precio a tu cabeza y aun así apostó a que Roman te salvaría.⟧
⟦DONE|say|Expresa cómo abordar «Tu hermano admite que te usó de cebo. ¿Qué harás?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Redacción independiente
⟦BG|bg_b_c11s01|Redacción independiente⟧
⟦TIME|17:00⟧
⟦IF|b_c10_a⟧
Narración: Policía y abogado conservan los datos del vehículo y verifican el riesgo independientemente.
⟦/IF⟧
⟦IF|b_c10_b⟧
Narración: Entregan los registros de reparto; la preocupación no los exime de preguntas.
⟦/IF⟧
⟦IF|b_c10_c⟧
Narración: Su respuesta evasiva queda registrada; ser tu hermano no lo exime de verificación.
⟦/IF⟧
Narración: La décima tarde, en la redacción independiente, Nadia descubre que Luca está reservando en tu nombre real una reunión secreta con el contacto de compras de armas de la antigua organización.
Narración: Deja la reserva en la mesa. Busca 💌 si necesitas una pausa antes de preguntar o cancelar.
⟦MG|g_find_letter⟧
Nadia: «Esto no es protegerte. Te ha escrito dentro del peligro. ¿Preguntamos directamente a Luca o cancelamos antes la reserva?»
⟦FREE⟧
Narración: Las observaciones dicen: «Mi hermana traerá el libro». 

# SCENE｜Viejo almacén del puerto
⟦BG|bg_b_c11s02|Viejo almacén del puerto⟧
⟦TIME|17:25⟧
Narración: Después, en el almacén del muelle viejo, Luca ve la reserva que llevas, se queda inmóvil y luego se enfada: dice que solo quería obligar a Roman a aparecer. Desde el otro lado del puente, Roman os ve discutir y aprieta la barandilla, sin cruzar la distancia que marcaste.
Luca: «Me debe una vida. ¿No quieres que la pague? ¿Quieres saber por qué usé tu nombre? Eso tengo que responderlo yo.».
⟦FREE⟧
Narración: Luca aparta la mirada. Comprendes que Roman no es la persona a quien más teme enfrentarse.

# SCENE｜Oficina del piso superior
⟦BG|bg_b_c11s03|Oficina del piso superior⟧
⟦TIME|17:50⟧
Narración: Después, en la oficina de la planta superior, abres el respaldo de voz de Luca. Se le oye pedir a un desconocido que filtre tu itinerario.
Narración: Pausa el audio. Repite las luces antes de decidir a quién entregar la grabación.
⟦MG|g_simon_lights⟧
Luca: «Creí que podía controlar el riesgo. Ahora sé lo absurdo que era. ¿Quieres oír cómo se organizó o entregar ya la grabación a la policía?»
⟦FREE⟧
Narración: Admite que sabía que podían poner precio a tu cabeza y aun así apostó a que Roman te salvaría.
⟦SET|b_c11_event⟧

# CHOICE｜Tu hermano admite que te usó de cebo. ¿Qué harás?
#### A｜Exigir que deje de usar tu nombre inmediatamente
Narración: Cancela la reunión antes de celebrarse; ya no eres el cebo.
⟦OPT|A|set:b_c11_a⟧
#### B｜Entregar el audio e implicar a los investigadores
Narración: Se recibe formalmente la prueba del uso de tu nombre; el parentesco no borra los hechos.
⟦OPT|B|set:b_c11_b⟧
#### C｜Suspender temporalmente todo contacto con ambos hombres
Narración: Solo pueden explicar hechos mediante abogados; tú investigas independientemente.
⟦OPT|C|set:b_c11_c⟧
# ·
Narración: Si los dos dicen quererte, ¿quién respetará tu negativa?

# CHAPTER 12｜Una investigación propia
⟦GOAL|Ya están las pruebas. ¿Dónde las harás públicas?|Una investigación propia⟧
⟦DONE|flag|b_c12_event|Presenciar el cambio clave|Narración: El abogado advierte: una vez entregado, el material no puede retirarse mediante contactos personales.⟧
⟦DONE|say|Expresa cómo abordar «Ya están las pruebas. ¿Dónde las harás públicas?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Pasarela del puerto
⟦BG|bg_b_c12s01|Pasarela del puerto⟧
⟦TIME|09:30⟧
⟦IF|b_c11_a⟧
Narración: Cancela la reunión antes de celebrarse; ya no eres el cebo.
⟦/IF⟧
⟦IF|b_c11_b⟧
Narración: Se recibe formalmente la prueba del uso de tu nombre; el parentesco no borra los hechos.
⟦/IF⟧
⟦IF|b_c11_c⟧
Narración: Solo pueden explicar hechos mediante abogados; tú investigas independientemente.
⟦/IF⟧
Narración: La undécima mañana, en el puente seguro del puerto, Roman atiende al abogado desde la otra orilla sin cruzar para tomar el mando. Luca está junto al puente. Nadie puede volver a decidir tu «protección» por ti.
Narración: Puedes detenerte junto al puente. Ordena las fichas 🗺 y elige después adónde ir.
⟦MG|g_slide_map⟧
Roman: «No tengo derecho a pedirte que perdones a nadie, incluido yo. ¿Quieres que nos retiremos los dos o que presentemos declaraciones separadas?»
⟦FREE⟧
Narración: Las luces de los barcos se apagan una a una bajo el puente. Un coche de prensa se detiene en la orilla. La tarea inmediata es contrastar el libro con las fechas de las operaciones.

# SCENE｜Sala de auditoría externa
⟦BG|bg_b_c12s02|Sala de auditoría externa⟧
⟦TIME|09:55⟧
Narración: Después, en la sala de auditoría externa, Nadia y tú contrastáis facturas de distintas fuentes: el sello letal procede de otro alto cargo, no de Roman. Él quiere darte la respuesta en persona, pero entrega primero el registro que más le perjudica.
Narración: Siguen comprobando las facturas. Mientras contrastan fuentes, empareja seis parejas de iconos.
⟦MG|g_mem_memory⟧
Nadia: «Esta tabla explica quién quería matar a Luca y quién se lucraba con él. ¿Entregamos primero los registros de víctimas o buscamos a quien emitió el sello?»
⟦FREE⟧
Narración: Un documento de seguros enlaza por completo el antiguo encubrimiento de Roman.

# SCENE｜Sala de reuniones del abogado
⟦BG|bg_b_c12s03|Sala de reuniones del abogado⟧
⟦TIME|10:20⟧
Narración: Después, en la sala del abogado, Roman entrega con su letrado las copias financieras previas a la quema. Bastan para exigirle responsabilidad penal.
Roman: «No puedo seguir usando tu seguridad para ocultar mis delitos. ¿Quieres oírme reconocerlos o aceptar solo mi declaración escrita?»
⟦FREE⟧
Narración: El abogado advierte: una vez entregado, el material no puede retirarse mediante contactos personales.
⟦SET|b_c12_event⟧

# CHOICE｜Ya están las pruebas. ¿Dónde las harás públicas?
#### A｜Proteger a las víctimas y entregar el libro completo
Narración: Los investigadores reciben el material con la privacidad de las víctimas protegida.
⟦OPT|A|set:b_c12_a⟧
#### B｜Contar tu experiencia sin declarar culpables a otros
Narración: El periodista recibe un relato personal verificado; la culpabilidad queda al procedimiento.
⟦OPT|B|set:b_c12_b⟧
#### C｜Precintar las pruebas hasta el peritaje profesional
Narración: Se preservan los originales para evitar daños de revelaciones sin verificar.
⟦OPT|C|set:b_c12_c⟧
# ·
Narración: ¿El libro que entrega Roman también lo sentará en el banquillo?

# CHAPTER 13｜El testimonio del diablo
⟦GOAL|Roman ha firmado. ¿Qué más quieres preguntarle?|El testimonio del diablo⟧
⟦DONE|flag|b_c13_event|Presenciar el cambio clave|Narración: La bola de espejos del techo se detiene lentamente. Por fin todo queda en silencio.⟧
⟦DONE|say|Expresa cómo abordar «Roman ha firmado. ¿Qué más quieres preguntarle?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Archivo de medios independiente
⟦BG|bg_b_c13s01|Archivo de medios independiente⟧
⟦TIME|10:00⟧
⟦IF|b_c12_a⟧
Narración: Los investigadores reciben el material con la privacidad de las víctimas protegida.
⟦/IF⟧
⟦IF|b_c12_b⟧
Narración: El periodista recibe un relato personal verificado; la culpabilidad queda al procedimiento.
⟦/IF⟧
⟦IF|b_c12_c⟧
Narración: Se preservan los originales para evitar daños de revelaciones sin verificar.
⟦/IF⟧
Narración: La duodécima mañana, en el archivo independiente de medios, haces varias copias resistentes a alteraciones de las fotos y vídeos originales, preparándolas para los investigadores adecuados.
Narración: Los originales están archivados. Busca 💌 mientras ordenas la mesa, antes de hablar de publicación.
⟦MG|g_find_letter⟧
Periodista independiente: «Tú decides cuánto de tu historia se publica. ¿Revelas la falsa muerte de tu hermano o proteges primero tu identidad?»
⟦FREE⟧
Narración: Mientras comprueban las copias, observa las luces y púlsalas en el mismo orden.
⟦MG|g_simon_lights⟧
Narración: Un correo anónimo advierte: si entregas las pruebas, arderá el club.

# SCENE｜Centro de asistencia jurídica
⟦BG|bg_b_c13s02|Centro de asistencia jurídica⟧
⟦TIME|10:25⟧
Narración: Después, en el centro de asistencia jurídica, Roman firma con su abogado una declaración completa que admite la vigilancia y la destrucción de pruebas. En el recuerdo de la pista vacía solo queda un viejo disco sin terminar; entre vosotros no hay armas ni excusas. La melodía cesa. Quiere decir que la noche es hermosa, pero solo pronuncia «Me declararé culpable».
Roman: «Acepto que me odies. Ya no decidiré tu respuesta. ¿Qué hecho necesitas que añada para no tener que seguir adivinando?»
⟦FREE⟧
Narración: Tras firmar, entrega por primera vez las llaves del club a una administración independiente.

# SCENE｜Pista de baile vacía
⟦BG|bg_b_c13s03|Pista de baile vacía⟧
⟦TIME|10:50⟧
Narración: Después, en la pista vacía, estáis por última vez en aquel salón sin música. Él no extiende la mano: deja sobre la mesa la tarjeta de acceso del primer encuentro.
Roman: «Si algún día podemos vernos, quisiera empezar con un café entre personas corrientes. ¿Quieres guardar este recuerdo o decirme que no debería continuar?»
⟦FREE⟧
Narración: La bola de espejos del techo se detiene lentamente. Por fin todo queda en silencio.
⟦SET|b_c13_event⟧

# CHOICE｜Roman ha firmado. ¿Qué más quieres preguntarle?
#### A｜Exigir que asuma toda la responsabilidad
Narración: Entrega el control del club por el procedimiento formal; el amor no compensa delitos.
⟦OPT|A|set:b_c13_a⟧
#### B｜Reconocer que tus sentimientos siguen siendo contradictorios
Narración: Acepta la contradicción sin interpretarla como perdón.
⟦OPT|B|set:b_c13_b⟧
#### C｜No dar respuesta emocional y exigir comunicación legal futura
Narración: El abogado registra los límites de contacto y mantiene clara la relación.
⟦OPT|C|set:b_c13_c⟧
# ·
Narración: ¿Puede asumir la responsabilidad abrir un nuevo comienzo?

# CHAPTER 14｜La última persecución
⟦GOAL|Surge una amenaza de incendio. ¿Qué proteges primero?|La última persecución⟧
⟦DONE|flag|b_c14_event|Presenciar el cambio clave|Narración: Tres nombres aparecen juntos en el expediente, cada uno con consecuencias legales propias.⟧
⟦DONE|say|Expresa cómo abordar «Surge una amenaza de incendio. ¿Qué proteges primero?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Callejón del club
⟦BG|bg_b_c14s01|Callejón del club⟧
⟦TIME|04:30⟧
⟦IF|b_c13_a⟧
Narración: Entrega el control del club por el procedimiento formal; el amor no compensa delitos.
⟦/IF⟧
⟦IF|b_c13_b⟧
Narración: Acepta la contradicción sin interpretarla como perdón.
⟦/IF⟧
⟦IF|b_c13_c⟧
Narración: El abogado registra los límites de contacto y mantiene clara la relación.
⟦/IF⟧
Narración: Antes del amanecer del decimotercer día, en el callejón del club, los bomberos retiran sustancias inflamables sospechosas de la puerta. La tentativa de incendio fue descubierta a tiempo. Los hombres de Roman no persiguen ni matan a nadie.
Narración: Espera lejos de la limpieza. Practica bloquear flashes: pulsa 📸 y evita 🙂.
⟦MG|g_whack_flash⟧
Nadia: «Quieren destruir el libro, no el edificio. ¿Enviamos ya las copias o documentamos primero el lugar?»
⟦FREE⟧
Narración: Las luces policiales se reflejan en el asfalto mojado. Roman declara dentro del cordón.

# SCENE｜Centro independiente de copias
⟦BG|bg_b_c14s02|Centro independiente de copias⟧
⟦TIME|04:55⟧
Narración: Después, en el centro de respaldo, Nadia y tú comprobáis tres copias independientes. El último emisor desconocido coincide con un alto cargo de la antigua organización. Desde el cordón Roman ve alejarse tu coche, sin ordenar que te sigan.
Narración: Siguen verificando tres copias. Mantén la atención repitiendo las luces en su orden.
⟦MG|g_simon_lights⟧
Nadia: «Esta vez no perderás la única prueba. ¿Reservas tus vivencias privadas o pides al periodista que cuente solo la cadena de hechos?»
⟦FREE⟧
Narración: Mientras se reciben oficialmente las pruebas, a lo lejos encienden luces por las víctimas. La tarea inmediata es completar una copia de las pruebas en otra ubicación.

# SCENE｜Sala de interrogatorios del puerto
⟦BG|bg_b_c14s03|Sala de interrogatorios del puerto⟧
⟦TIME|05:20⟧
Narración: Después, en la sala de entrevistas policial del puerto, Luca entrega los registros del uso de la información de su hermana. Roman declara por separado. Ninguno tiene derecho a competir por quién te quiere más.
Luca: «Te puse en la línea de fuego por venganza. ¿Sigo explicando o dejo de buscarte por un tiempo?»
⟦FREE⟧
Narración: Tres nombres aparecen juntos en el expediente, cada uno con consecuencias legales propias.
⟦SET|b_c14_event⟧

# CHOICE｜Surge una amenaza de incendio. ¿Qué proteges primero?
#### A｜Priorizar la evacuación de terceros y conservar el lugar
Narración: La evacuación se completa y se preservan las pruebas del lugar.
⟦OPT|A|set:b_c14_a⟧
#### B｜Presentar copias simultáneamente a varias instituciones
Narración: Ningún incendio aislado podrá destruir todas las pruebas.
⟦OPT|B|set:b_c14_b⟧
#### C｜Exigir a Luca que aclare la responsabilidad que omitió
Narración: Amplía su declaración y aclara la ruta oculta de la antigua organización.
⟦OPT|C|set:b_c14_c⟧
# ·
Narración: El incendio no destruyó las pruebas. ¿Quién responderá primero por sus delitos?

# CHAPTER 15｜Un libro de cuentas que sobrevivió
⟦GOAL|Comienza la investigación legal. ¿Cómo quieres hablar?|Un libro de cuentas que sobrevivió⟧
⟦DONE|flag|b_c15_event|Presenciar el cambio clave|Narración: Alguien en la librería lee un libro con tus fotografías.⟧
⟦DONE|say|Expresa cómo abordar «Comienza la investigación legal. ¿Cómo quieres hablar?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Oficina de investigación independiente
⟦BG|bg_b_c15s01|Oficina de investigación independiente⟧
⟦TIME|11:00⟧
⟦IF|b_c14_a⟧
Narración: La evacuación se completa y se preservan las pruebas del lugar.
⟦/IF⟧
⟦IF|b_c14_b⟧
Narración: Ningún incendio aislado podrá destruir todas las pruebas.
⟦/IF⟧
⟦IF|b_c14_c⟧
Narración: Amplía su declaración y aclara la ruta oculta de la antigua organización.
⟦/IF⟧
Narración: La decimocuarta mañana, en la oficina independiente de investigación, los reguladores reciben el libro, los registros telefónicos y toda la vigilancia. Recibes una notificación formal de protección de tu privacidad.
Narración: Mientras termina la recepción, busca 💌 antes de revisar el recibo oficial.
⟦MG|g_find_letter⟧
Investigador: «Esto es material de investigación, no una prueba de amor. ¿Quieres contar públicamente tu experiencia o participar solo como testigo?»
⟦FREE⟧
Narración: El recibo llega a tus manos. Por fin hay una vía de conservación de pruebas independiente de Roman.

# SCENE｜Banco del pasillo del hospital
⟦BG|bg_b_c15s02|Banco del pasillo del hospital⟧
⟦TIME|11:25⟧
Narración: Después, en un banco del pasillo del hospital, terminas la explicación escrita de Luca. Admite fingir la muerte y usarte para atraer a Roman. No exige perdón ni dice «espérame». Por primera vez puedes dejar de responsabilizarte de él.
Luca: «Puedes verme como tu hermano o no verme de momento. ¿Cómo querrías empezar de nuevo, o necesitas tiempo?»
⟦FREE⟧
Narración: Una enfermera pasa empujando un carro. El mundo real no se ha detenido por nadie.

# SCENE｜Librería independiente
⟦BG|bg_b_c15s03|Librería independiente⟧
⟦TIME|11:50⟧
Narración: Después, en la librería independiente junto a la ventana, el abogado de Roman trae una declaración complementaria sin insinuaciones románticas y una disculpa que permite no responder.
Narración: La respuesta puede esperar. Busca 💌 entre los papeles y date tiempo para leer.
⟦MG|g_find_letter⟧
Abogado independiente: «Su caso sigue. Tu vida también. ¿Guardamos las cartas aquí o terminamos todo contacto?»
⟦FREE⟧
Narración: Alguien en la librería lee un libro con tus fotografías.
⟦SET|b_c15_event⟧

# CHOICE｜Comienza la investigación legal. ¿Cómo quieres hablar?
#### A｜Anunciar solo la entrega de pruebas, sin romance privado
Narración: El público conoce el avance del caso y se conserva la privacidad.
⟦OPT|A|set:b_c15_a⟧
#### B｜Contar tu camino mediante tus fotografías
Narración: La exposición conserva tu versión sin blanquear a Roman.
⟦OPT|B|set:b_c15_b⟧
#### C｜Guardar silencio y recuperar primero una vida tranquila
Narración: Se respeta tu silencio sin afectar la tramitación formal de las pruebas.
⟦OPT|C|set:b_c15_c⟧
# ·
Narración: ¿Qué precio tendría querer amar a un culpable?

# CHAPTER 16｜La puerta que abres tú
⟦GOAL|Si respeta los límites en el futuro, ¿cómo quieres vivir?|La puerta que abres tú⟧
⟦DONE|flag|b_c16_event|Presenciar el cambio clave|Narración: En el visor solo queda la siguiente escena que elijas por voluntad propia.⟧
⟦DONE|say|Expresa cómo abordar «Si respeta los límites en el futuro, ¿cómo quieres vivir?»: preguntar, acercarte, rechazar o aplazar.|Expresar tu intención|Narración: Puedes expresar tus condiciones o pedir verificación primero.⟧

# SCENE｜Galería fotográfica de barrio
⟦BG|bg_b_c16s01|Galería fotográfica de barrio⟧
⟦TIME|10:30⟧
⟦IF|b_c15_a⟧
Narración: El público conoce el avance del caso y se conserva la privacidad.
⟦/IF⟧
⟦IF|b_c15_b⟧
Narración: La exposición conserva tu versión sin blanquear a Roman.
⟦/IF⟧
⟦IF|b_c15_c⟧
Narración: Se respeta tu silencio sin afectar la tramitación formal de las pruebas.
⟦/IF⟧
Narración: Meses después, en la galería de la esquina, inauguras tu exposición documental. En las paredes no están Roman ni Luca: solo la ciudad y las personas que fotografiaste.
Narración: Antes de la exposición, ordena las fichas 📷 y vuelve la atención a tu trabajo.
⟦MG|g_slide_photo⟧
Responsable de la galería: «Puedes firmar estas obras con tu nombre completo. ¿Qué título darás a la exposición o prefieres ver antes la carta remitida por el tribunal?»
⟦FREE⟧
Narración: Aún queda preparar las fotos de la exposición. Practica pulsar 📸 y evitar 🙂, y vuelve después a las obras.
⟦MG|g_whack_flash⟧
Narración: Suena la campanilla de la entrada. Un abogado conocido espera fuera.

# SCENE｜Salón tranquilo de la galería
⟦BG|bg_b_c16s02|Salón tranquilo de la galería⟧
⟦TIME|10:55⟧
Narración: Después, en la tranquila zona de descanso, la carta de Roman por medio del abogado solo informa del caso y promete algo que puede cumplir: no volver a investigar tu vida privada sin permiso. No hay perfume ni palabras seductoras, solo una actualización real y contenida.
Roman (carta): «Si algún día hay una oportunidad, solo quiero que sepas que por fin he aprendido a respetar los límites».
⟦FREE⟧
Narración: Puedes responder o dejar la carta como final de esta historia. En el espacio en blanco del sobre no hay petición de respuesta ni prisa.

# SCENE｜Calle de la ciudad por la mañana
⟦BG|bg_b_c16s03|Calle de la ciudad por la mañana⟧
⟦TIME|11:20⟧
Narración: Después, en la calle de la mañana, unos compran flores y otros corren al metro. Caminas a tu ritmo, sin avisos extraños de seguimiento en el móvil. El sol ilumina el puente; los hombres peligrosos de anoche vuelven a sus propias responsabilidades.
Narración: ¿Qué relación futura querrías tener con él, o prefieres continuar tu propia vida?
⟦FREE⟧
Narración: En el visor solo queda la siguiente escena que elijas por voluntad propia.
⟦SET|b_c16_event⟧

# CHOICE｜Si respeta los límites en el futuro, ¿cómo quieres vivir?
#### A｜Dejar una posibilidad de conocerlo despacio, solo si es legal y seguro
Narración: No hay promesa de reencuentro inmediato, solo espacio para hablar honestamente después.
⟦OPT|A|set:b_c16_a⟧
#### B｜Cerrar la posibilidad romántica y mantener solo contacto factual necesario
Narración: Roman deja de hacer peticiones privadas y tu vida sigue completa.
⟦OPT|B|set:b_c16_b⟧
#### C｜Elegir una nueva vida libre e independiente de cualquiera
Narración: Defines el amor por ti y dejas de esperar la redención de otra persona.
⟦OPT|C|set:b_c16_c⟧
# ·
Narración: El objetivo mira a lo lejos. Nadie vuelve a decidir por ti a quién amar.
