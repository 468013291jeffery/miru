# CHAPTER 1｜La orden de muerte
⟦GOAL|Comprender lo ocurrido en «La orden de muerte» y decidir el siguiente paso.|La orden de muerte⟧
⟦DONE|flag|b_c01_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La orden de muerte», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Club subterráneo
⟦BG|bg_b_c01s01|Club subterráneo；Personajes presentes：Tú, Roman；Acción：Los graves hacen vibrar las copas. Dejas la orden de detención firmada ante Roman. Él aparta la pistola para dejarla lejos de los dos.⟧
⟦TIME|02:00⟧
Narración: A las dos de la madrugada. Club subterráneo.
Narración: Los graves hacen vibrar las copas.
Narración: Dejas la orden de detención firmada ante Roman.
Narración: Él aparta la pistola para dejarla lejos de los dos.
Roman: “Firmé la orden de detención. No ordené que lo mataran.”
⟦FREE⟧
Narración: Próxima escena: Despacho privado del club.

# SCENE｜Despacho privado del club
⟦BG|bg_b_c01s02|Despacho privado del club；Personajes presentes：Tú, Roman；Acción：Saca tres versiones de la orden. Solo una lleva la marca roja añadida después. Fuera parpadea una luz de aviso.⟧
⟦TIME|02:25⟧
Narración: Poco después. Despacho privado del club.
Narración: Saca tres versiones de la orden.
Narración: Solo una lleva la marca roja añadida después.
Narración: Fuera parpadea una luz de aviso.
Roman: “No te fíes de mí solo porque te lo diga. Mira los documentos.”
⟦FREE⟧
Narración: Próxima escena: Escalera de emergencia.

# SCENE｜Escalera de emergencia
⟦BG|bg_b_c01s03|Escalera de emergencia；Personajes presentes：Tú, Roman；Acción：Se apagan las luces. Roman te ofrece la llave de salida. En la pantalla de emergencia figura tu nombre como objetivo y Roman Moretti como comprador de la recompensa.⟧
⟦TIME|02:50⟧
Narración: Poco después. Escalera de emergencia.
Narración: Se apagan las luces.
Narración: Roman te ofrece la llave de salida.
Narración: En la pantalla de emergencia figura tu nombre como objetivo y Roman Moretti como comprador de la recompensa.
Roman: “Puedo explicarte por qué compré ese encargo. No tienes que quedarte aquí para escucharme.”
⟦FREE⟧
⟦SET|b_c01_event⟧

# CHOICE｜¿Quién puso primero tu nombre en la lista?
#### A｜Fotografiar la lista y marcharte
Narración: El abogado independiente recibe una copia.
⟦OPT|A|set:b_c01_a⟧
#### B｜Exigir una explicación por la compra de la recompensa
Narración: Roman admite que la compró para impedir que otros la aceptaran; queda registrada su declaración.
⟦OPT|B|set:b_c01_b⟧
#### C｜Verificar la orden original sin aceptar protección
Narración: Roman entrega el original y deja las decisiones de seguridad en tus manos.
⟦OPT|C|set:b_c01_c⟧
# ·
Narración: ¿Quién puso primero tu nombre en la lista?

# CHAPTER 2｜El hombre al otro lado de tu puerta
⟦GOAL|Comprender lo ocurrido en «El hombre al otro lado de tu puerta» y decidir el siguiente paso.|El hombre al otro lado de tu puerta⟧
⟦DONE|flag|b_c02_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «El hombre al otro lado de tu puerta», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Bufete independiente
⟦BG|bg_b_c02s01|Bufete independiente；Personajes presentes：Tú, Roman；Acción：El abogado presenta tres alojamientos provisionales y datos de contacto independientes. Roman espera junto a la ventana.⟧
⟦TIME|22:00⟧
Narración: La noche siguiente. Bufete independiente.
⟦IF|b_c01_a⟧
Narración: El abogado independiente recibe una copia.
⟦/IF⟧
⟦IF|b_c01_b⟧
Narración: Roman admite que la compró para impedir que otros la aceptaran; queda registrada su declaración.
⟦/IF⟧
⟦IF|b_c01_c⟧
Narración: Roman entrega el original y deja las decisiones de seguridad en tus manos.
⟦/IF⟧
Narración: El abogado presenta tres alojamientos provisionales y datos de contacto independientes.
Narración: Roman espera junto a la ventana.
Roman: “Puedes elegir un sitio que yo no conozca.”
⟦FREE⟧
Narración: Próxima escena: Salón del apartamento.

# SCENE｜Salón del apartamento
⟦BG|bg_b_c02s02|Salón del apartamento；Personajes presentes：Tú, Roman；Acción：Aparece un viejo disco de jazz bajo la puerta. Dentro hay un código de tu infancia. La etiqueta del envío es de hace tres semanas. Roman deja un café fuera.⟧
⟦TIME|22:25⟧
Narración: Poco después. Salón del apartamento.
Narración: Aparece un viejo disco de jazz bajo la puerta.
Narración: Dentro hay un código de tu infancia.
Narración: La etiqueta del envío es de hace tres semanas.
Narración: Roman deja un café fuera.
Roman: “Tu hermano solía contarme cosas. Pregúntame cuáles.”
⟦FREE⟧
Narración: Próxima escena: Pasillo del apartamento.

# SCENE｜Pasillo del apartamento
⟦BG|bg_b_c02s03|Pasillo del apartamento；Personajes presentes：Tú, Roman；Acción：Se sienta en el otro extremo del pasillo con un botiquín sin abrir. Junto a la puerta hay una foto chamuscada de un almacén.⟧
⟦TIME|22:50⟧
Narración: Poco después. Pasillo del apartamento.
Narración: Se sienta en el otro extremo del pasillo con un botiquín sin abrir.
Narración: Junto a la puerta hay una foto chamuscada de un almacén.
Roman: “No voy a entrar. Si quieres que me marche, dímelo.”
⟦FREE⟧
⟦SET|b_c02_event⟧

# CHOICE｜¿Su preocupación es protección o vigilancia?
#### A｜Pedir a Nadia que investigue el origen del disco
Narración: El registro de envío y el código proporcionan una pista.
⟦OPT|A|set:b_c02_a⟧
#### B｜Pedir a Roman una declaración escrita sobre Luca
Narración: Su versión queda fijada para contrastarla.
⟦OPT|B|set:b_c02_b⟧
#### C｜Mudarte para evitar la vigilancia
Narración: El abogado organiza un alojamiento sin revelar la dirección a Roman.
⟦OPT|C|set:b_c02_c⟧
# ·
Narración: ¿Su preocupación es protección o vigilancia?

# CHAPTER 3｜¿Detención o asesinato?
⟦GOAL|Comprender lo ocurrido en «¿Detención o asesinato?» y decidir el siguiente paso.|¿Detención o asesinato?⟧
⟦DONE|flag|b_c03_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «¿Detención o asesinato?», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Centro de archivos
⟦BG|bg_b_c03s01|Centro de archivos；Personajes presentes：Tú, Nadia；Acción：El examen revela que la marca roja es posterior a la firma de Roman. Han borrado el número de un archivero.⟧
⟦TIME|11:00⟧
Narración: La mañana del tercer día. Centro de archivos.
⟦IF|b_c02_a⟧
Narración: El registro de envío y el código proporcionan una pista.
⟦/IF⟧
⟦IF|b_c02_b⟧
Narración: Su versión queda fijada para contrastarla.
⟦/IF⟧
⟦IF|b_c02_c⟧
Narración: El abogado organiza un alojamiento sin revelar la dirección a Roman.
⟦/IF⟧
Narración: El examen revela que la marca roja es posterior a la firma de Roman.
Narración: Han borrado el número de un archivero.
Nadia: “El papel y la tinta contradicen la cronología oficial.”
⟦FREE⟧
Narración: Próxima escena: Despacho del club cerrado.

# SCENE｜Despacho del club cerrado
⟦BG|bg_b_c03s02|Despacho del club cerrado；Personajes presentes：Tú, Roman；Acción：Roman admite haber destruido las grabaciones originales tras la operación para ocultar transacciones de su propio libro contable. Bajo su reloj aparece una antigua quemadura.⟧
⟦TIME|11:25⟧
Narración: Poco después. Despacho del club cerrado.
Narración: Roman admite haber destruido las grabaciones originales tras la operación para ocultar transacciones de su propio libro contable.
Narración: Bajo su reloj aparece una antigua quemadura.
Roman: “Destruí pruebas. No voy a fingir que soy inocente.”
⟦FREE⟧
Narración: Próxima escena: Cuarto oscuro de fotografía.

# SCENE｜Cuarto oscuro de fotografía
⟦BG|bg_b_c03s03|Cuarto oscuro de fotografía；Personajes presentes：Tú, Nadia；Acción：La última llamada de Luca a tu número fue desviada. Un fragmento de su voz advierte que no confíes en el funeral.⟧
⟦TIME|11:50⟧
Narración: Poco después. Cuarto oscuro de fotografía.
Narración: La última llamada de Luca a tu número fue desviada.
Narración: Un fragmento de su voz advierte que no confíes en el funeral.
Nadia: “Hay que averiguar adónde desviaron la llamada.”
⟦FREE⟧
⟦SET|b_c03_event⟧

# CHOICE｜¿Qué intentaba decirte Luca en aquella llamada?
#### A｜Exigir el nombre de quien manejó la orden por última vez
Narración: Roman proporciona el nombre y el registro de entrega.
⟦OPT|A|set:b_c03_a⟧
#### B｜Rastrear la llamada desviada
Narración: Se conservan los registros de comunicaciones.
⟦OPT|B|set:b_c03_b⟧
#### C｜Terminar los encuentros privados con Roman
Narración: Las pruebas se transmiten mediante el abogado.
⟦OPT|C|set:b_c03_c⟧
# ·
Narración: ¿Qué intentaba decirte Luca en aquella llamada?

# CHAPTER 4｜Solo un baile
⟦GOAL|Comprender lo ocurrido en «Solo un baile» y decidir el siguiente paso.|Solo un baile⟧
⟦DONE|flag|b_c04_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Solo un baile», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Pista de baile a medianoche
⟦BG|bg_b_c04s01|Pista de baile a medianoche；Personajes presentes：Tú, Roman；Acción：Un invitado te llama la nueva mujer de Moretti. Roman se detiene a un brazo de distancia sin cogerte por la cintura.⟧
⟦TIME|23:00⟧
Narración: La cuarta noche. Pista de baile a medianoche.
⟦IF|b_c03_a⟧
Narración: Roman proporciona el nombre y el registro de entrega.
⟦/IF⟧
⟦IF|b_c03_b⟧
Narración: Se conservan los registros de comunicaciones.
⟦/IF⟧
⟦IF|b_c03_c⟧
Narración: Las pruebas se transmiten mediante el abogado.
⟦/IF⟧
Narración: Un invitado te llama la nueva mujer de Moretti.
Narración: Roman se detiene a un brazo de distancia sin cogerte por la cintura.
Roman: “Ella no me pertenece. ¿Quieres quedarte aquí?”
⟦FREE⟧
Narración: Próxima escena: Reservado rojo.

# SCENE｜Reservado rojo
⟦BG|bg_b_c04s02|Reservado rojo；Personajes presentes：Tú, Roman；Acción：Una nota lleva la marca del interior del antiguo anillo de Luca. Roman la reconoce. Nadia aparece tras la cortina.⟧
⟦TIME|23:25⟧
Narración: Poco después. Reservado rojo.
Narración: Una nota lleva la marca del interior del antiguo anillo de Luca.
Narración: Roman la reconoce.
Narración: Nadia aparece tras la cortina.
Roman: “Quiero acercarme a ti, pero no tienes por qué dejarme.”
⟦FREE⟧
Narración: Próxima escena: Pasillo entre bastidores.

# SCENE｜Pasillo entre bastidores
⟦BG|bg_b_c04s03|Pasillo entre bastidores；Personajes presentes：Tú, Nadia；Acción：Nadia presenta una foto del puerto: alguien se marcha con el anillo de Luca. Roman reconoce la fecha grabada.⟧
⟦TIME|23:50⟧
Narración: Poco después. Pasillo entre bastidores.
Narración: Nadia presenta una foto del puerto: alguien se marcha con el anillo de Luca.
Narración: Roman reconoce la fecha grabada.
Nadia: “Esta foto es anterior al informe. Conservemos el original.”
⟦FREE⟧
⟦SET|b_c04_event⟧

# CHOICE｜¿Pueden convivir la ternura y la culpa en una misma persona?
#### A｜Elegir expresamente bailar y preguntar
Narración: La conversación aporta la pista de la nota solo si eliges bailar.
⟦OPT|A|set:b_c04_a⟧
#### B｜Exigir que corrija la etiqueta posesiva
Narración: Roman corrige públicamente esa descripción.
⟦OPT|B|set:b_c04_b⟧
#### C｜Rechazar el baile e investigar la nota con Nadia
Narración: La pista se conserva sin que haya ningún baile.
⟦OPT|C|set:b_c04_c⟧
# ·
Narración: ¿Pueden convivir la ternura y la culpa en una misma persona?

# CHAPTER 5｜Él también sangra
⟦GOAL|Comprender lo ocurrido en «Él también sangra» y decidir el siguiente paso.|Él también sangra⟧
⟦DONE|flag|b_c05_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Él también sangra», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Zona médica del garaje
⟦BG|bg_b_c05s01|Zona médica del garaje；Personajes presentes：Tú, Roman；Acción：Roman resulta herido al proteger a un testigo a punto de declarar. Comprueba el estado del conductor antes de sentarse.⟧
⟦TIME|03:00⟧
Narración: La mañana del quinto día. Zona médica del garaje.
⟦IF|b_c04_a⟧
Narración: La conversación aporta la pista de la nota solo si eliges bailar.
⟦/IF⟧
⟦IF|b_c04_b⟧
Narración: Roman corrige públicamente esa descripción.
⟦/IF⟧
⟦IF|b_c04_c⟧
Narración: La pista se conserva sin que haya ningún baile.
⟦/IF⟧
Narración: Roman resulta herido al proteger a un testigo a punto de declarar.
Narración: Comprueba el estado del conductor antes de sentarse.
Roman: “Asegúrate de que está bien. Luego pregúntame lo que necesites.”
⟦FREE⟧
Narración: Próxima escena: Clínica provisional.

# SCENE｜Clínica provisional
⟦BG|bg_b_c05s02|Clínica provisional；Personajes presentes：Tú, Roman；Acción：Un médico le trata el hombro. Un llavero conocido fue registrado como prueba semanas después de la supuesta muerte de Luca.⟧
⟦TIME|03:25⟧
Narración: Poco después. Clínica provisional.
Narración: Un médico le trata el hombro.
Narración: Un llavero conocido fue registrado como prueba semanas después de la supuesta muerte de Luca.
Roman: “No dejes de hacerme la pregunta que te trajo aquí solo porque me ves sangrar.”
⟦FREE⟧
Narración: Próxima escena: Oficina del aparcamiento.

# SCENE｜Oficina del aparcamiento
⟦BG|bg_b_c05s03|Oficina del aparcamiento；Personajes presentes：Tú, Nadia；Acción：El registro de admisión del hospital muestra que alguien entregó el llavero después de la supuesta muerte de Luca. En su muñeca hay un dibujo familiar.⟧
⟦TIME|03:50⟧
Narración: Poco después. Oficina del aparcamiento.
Narración: El registro de admisión del hospital muestra que alguien entregó el llavero después de la supuesta muerte de Luca.
Narración: En su muñeca hay un dibujo familiar.
Nadia: “Esa fecha importa más que cualquier promesa.”
⟦FREE⟧
⟦SET|b_c05_event⟧

# CHOICE｜¿Cómo aparecieron las pertenencias de Luca después de su muerte?
#### A｜Ayudar al médico sin aceptar intimidad
Narración: La atención médica no equivale a una absolución.
⟦OPT|A|set:b_c05_a⟧
#### B｜Examinar la fecha de entrada del llavero
Narración: El hospital conserva la cadena de custodia.
⟦OPT|B|set:b_c05_b⟧
#### C｜Marcharte y encargar un examen independiente
Narración: Nadia obtiene una copia sin exigir que te quedes con Roman.
⟦OPT|C|set:b_c05_c⟧
# ·
Narración: ¿Cómo aparecieron las pertenencias de Luca después de su muerte?

# CHAPTER 6｜El expediente privado
⟦GOAL|Comprender lo ocurrido en «El expediente privado» y decidir el siguiente paso.|El expediente privado⟧
⟦DONE|flag|b_c06_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «El expediente privado», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Despacho de Roman
⟦BG|bg_b_c06s01|Despacho de Roman；Personajes presentes：Tú, Roman；Acción：Tras la estantería hay fotos de tus entrevistas, horarios y tu antigua dirección. Roman guarda los dispositivos en bolsas de pruebas.⟧
⟦TIME|14:00⟧
Narración: La tarde del sexto día. Despacho de Roman.
⟦IF|b_c05_a⟧
Narración: La atención médica no equivale a una absolución.
⟦/IF⟧
⟦IF|b_c05_b⟧
Narración: El hospital conserva la cadena de custodia.
⟦/IF⟧
⟦IF|b_c05_c⟧
Narración: Nadia obtiene una copia sin exigir que te quedes con Roman.
⟦/IF⟧
Narración: Tras la estantería hay fotos de tus entrevistas, horarios y tu antigua dirección.
Narración: Roman guarda los dispositivos en bolsas de pruebas.
Roman: “No tenía derecho a recopilar esto. Revísalo con tu abogado.”
⟦FREE⟧
Narración: Próxima escena: Almacén del despacho.

# SCENE｜Almacén del despacho
⟦BG|bg_b_c06s02|Almacén del despacho；Personajes presentes：Tú, Roman；Acción：Revoca el acceso ante el abogado. La foto más antigua es anterior a tu investigación.⟧
⟦TIME|14:25⟧
Narración: Poco después. Almacén del despacho.
Narración: Revoca el acceso ante el abogado.
Narración: La foto más antigua es anterior a tu investigación.
Roman: “No voy a pedir que confíes en mí por habértelo entregado.”
⟦FREE⟧
Narración: Próxima escena: Cafetería independiente.

# SCENE｜Cafetería independiente
⟦BG|bg_b_c06s03|Cafetería independiente；Personajes presentes：Tú, Nadia；Acción：El reverso de una foto lleva el código infantil de Luca. La pista geográfica señala un acuario abandonado.⟧
⟦TIME|14:50⟧
Narración: Poco después. Cafetería independiente.
Narración: El reverso de una foto lleva el código infantil de Luca.
Narración: La pista geográfica señala un acuario abandonado.
Nadia: “Quizá tu hermano utilizó el expediente para enviarte un mensaje.”
⟦FREE⟧
⟦SET|b_c06_event⟧

# CHOICE｜¿Quién empezó a buscarte antes de que conocieras a Roman?
#### A｜Exigir el cese del acceso y conservar las pruebas
Narración: Roman pierde el acceso y se custodia el material.
⟦OPT|A|set:b_c06_a⟧
#### B｜Solicitar que se investigue la vigilancia
Narración: Los registros se someten a revisión independiente.
⟦OPT|B|set:b_c06_b⟧
#### C｜Cortar el contacto privado
Narración: Roman queda limitado a los cauces legales.
⟦OPT|C|set:b_c06_c⟧
# ·
Narración: ¿Quién empezó a buscarte antes de que conocieras a Roman?

# CHAPTER 7｜Un hermano que sigue vivo
⟦GOAL|Comprender lo ocurrido en «Un hermano que sigue vivo» y decidir el siguiente paso.|Un hermano que sigue vivo⟧
⟦DONE|flag|b_c07_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Un hermano que sigue vivo», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Archivo de la estación suburbana
⟦BG|bg_b_c07s01|Archivo de la estación suburbana；Personajes presentes：Tú, Nadia；Acción：Un vídeo de hace un mes muestra a un hombre con la cicatriz característica de Luca en la ceja. Un mensaje de voz reciente contiene el código de vuestra infancia.⟧
⟦TIME|16:00⟧
Narración: La tarde del séptimo día. Archivo de la estación suburbana.
⟦IF|b_c06_a⟧
Narración: Roman pierde el acceso y se custodia el material.
⟦/IF⟧
⟦IF|b_c06_b⟧
Narración: Los registros se someten a revisión independiente.
⟦/IF⟧
⟦IF|b_c06_c⟧
Narración: Roman queda limitado a los cauces legales.
⟦/IF⟧
Narración: Un vídeo de hace un mes muestra a un hombre con la cicatriz característica de Luca en la ceja.
Narración: Un mensaje de voz reciente contiene el código de vuestra infancia.
Nadia: “Tenemos que contrastar la voz y la fecha.”
⟦FREE⟧
Narración: Próxima escena: Bufete independiente.

# SCENE｜Bufete independiente
⟦BG|bg_b_c07s02|Bufete independiente；Personajes presentes：Tú, Roman；Acción：Roman escucha el mensaje y admite que acaba de enterarse del vídeo. El abogado propone un modo seguro de llegar al acuario.⟧
⟦TIME|16:25⟧
Narración: Poco después. Bufete independiente.
Narración: Roman escucha el mensaje y admite que acaba de enterarse del vídeo.
Narración: El abogado propone un modo seguro de llegar al acuario.
Roman: “No sabía que seguía vivo. No voy a fingir que lo sabía.”
⟦FREE⟧
Narración: Próxima escena: Sala de análisis de audio.

# SCENE｜Sala de análisis de audio
⟦BG|bg_b_c07s03|Sala de análisis de audio；Personajes presentes：Tú, Nadia；Acción：Los avisos recientes de fondo confirman que la grabación es nueva. La voz de Luca te advierte que no entregues el disco duro a Roman.⟧
⟦TIME|16:50⟧
Narración: Poco después. Sala de análisis de audio.
Narración: Los avisos recientes de fondo confirman que la grabación es nueva.
Narración: La voz de Luca te advierte que no entregues el disco duro a Roman.
Nadia: “Podemos verificar la identidad antes de decidir si os veis.”
⟦FREE⟧
⟦SET|b_c07_event⟧

# CHOICE｜¿Por qué te advierte Luca sobre el disco?
#### A｜Organizar un encuentro con un abogado independiente
Narración: Se dispone de testigo y medidas de seguridad.
⟦OPT|A|set:b_c07_a⟧
#### B｜Permitir una conversación privada con contacto de emergencia independiente
Narración: El encuentro sigue siendo voluntario y ajeno a Roman.
⟦OPT|B|set:b_c07_b⟧
#### C｜Verificar antes la voz y la identidad
Narración: La autenticación precede al encuentro.
⟦OPT|C|set:b_c07_c⟧
# ·
Narración: ¿Por qué te advierte Luca sobre el disco?

# CHAPTER 8｜Media verdad en el acuario
⟦GOAL|Comprender lo ocurrido en «Media verdad en el acuario» y decidir el siguiente paso.|Media verdad en el acuario⟧
⟦DONE|flag|b_c08_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Media verdad en el acuario», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Taquilla del acuario abandonado
⟦BG|bg_b_c08s01|Taquilla del acuario abandonado；Personajes presentes：Tú, Luca；Acción：Un recuerdo de tu infancia se desliza bajo el cristal. Una silueta familiar espera tras el tanque oscuro.⟧
⟦TIME|19:00⟧
Narración: Esa noche. Taquilla del acuario abandonado.
⟦IF|b_c07_a⟧
Narración: Se dispone de testigo y medidas de seguridad.
⟦/IF⟧
⟦IF|b_c07_b⟧
Narración: El encuentro sigue siendo voluntario y ajeno a Roman.
⟦/IF⟧
⟦IF|b_c07_c⟧
Narración: La autenticación precede al encuentro.
⟦/IF⟧
Narración: Un recuerdo de tu infancia se desliza bajo el cristal.
Narración: Una silueta familiar espera tras el tanque oscuro.
Luca: “Lo reconoces, ¿verdad?”
⟦FREE⟧
Narración: Próxima escena: Pasillo acristalado del acuario.

# SCENE｜Pasillo acristalado del acuario
⟦BG|bg_b_c08s02|Pasillo acristalado del acuario；Personajes presentes：Tú, Luca；Acción：Luca se acerca con una nueva cicatriz y se detiene antes de abrazarte. Roman espera en la salida. Luca evita explicar cómo sobrevivió.⟧
⟦TIME|19:25⟧
Narración: Poco después. Pasillo acristalado del acuario.
Narración: Luca se acerca con una nueva cicatriz y se detiene antes de abrazarte.
Narración: Roman espera en la salida.
Narración: Luca evita explicar cómo sobrevivió.
Luca: “Quería volver. No podía contártelo todo.”
⟦FREE⟧
Narración: Próxima escena: Almacén del acuario.

# SCENE｜Almacén del acuario
⟦BG|bg_b_c08s03|Almacén del acuario；Personajes presentes：Tú, Luca；Acción：Luca te ofrece un disco duro negro con supuestos registros de los delitos de Roman. Una nota del armario contiene tu nombre y la hora de la cita.⟧
⟦TIME|19:50⟧
Narración: Poco después. Almacén del acuario.
Narración: Luca te ofrece un disco duro negro con supuestos registros de los delitos de Roman.
Narración: Una nota del armario contiene tu nombre y la hora de la cita.
Luca: “No se lo des. Por favor.”
⟦FREE⟧
⟦SET|b_c08_event⟧

# CHOICE｜¿Por qué necesita tu hermano vivo que ocultes sus pruebas?
#### A｜Rechazar la ocultación y pedir custodia de un tercero
Narración: El disco queda bajo custodia independiente.
⟦OPT|A|set:b_c08_a⟧
#### B｜Conservar una copia y documentar la entrega
Narración: Se registra la procedencia y la hora.
⟦OPT|B|set:b_c08_b⟧
#### C｜Exigir que Luca explique su supervivencia
Narración: Luca reconoce haber fingido su muerte.
⟦OPT|C|set:b_c08_c⟧
# ·
Narración: ¿Por qué necesita tu hermano vivo que ocultes sus pruebas?

# CHAPTER 9｜Un plan oculto tras el deseo
⟦GOAL|Comprender lo ocurrido en «Un plan oculto tras el deseo» y decidir el siguiente paso.|Un plan oculto tras el deseo⟧
⟦DONE|flag|b_c09_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Un plan oculto tras el deseo», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Salida del acuario
⟦BG|bg_b_c09s01|Salida del acuario；Personajes presentes：Tú, Roman；Acción：Roman permanece fuera, tal como acordasteis. Luca te grita que no subas al coche de Roman.⟧
⟦TIME|21:00⟧
Narración: La noche siguiente. Salida del acuario.
⟦IF|b_c08_a⟧
Narración: El disco queda bajo custodia independiente.
⟦/IF⟧
⟦IF|b_c08_b⟧
Narración: Se registra la procedencia y la hora.
⟦/IF⟧
⟦IF|b_c08_c⟧
Narración: Luca reconoce haber fingido su muerte.
⟦/IF⟧
Narración: Roman permanece fuera, tal como acordasteis.
Narración: Luca te grita que no subas al coche de Roman.
Roman: “No decidiré cómo te marchas.”
⟦FREE⟧
Narración: Próxima escena: Bar de jazz vacío.

# SCENE｜Bar de jazz vacío
⟦BG|bg_b_c09s02|Bar de jazz vacío；Personajes presentes：Tú, Roman；Acción：Roman expone los documentos sobre su plan para acercarse a ti. Entrega su dispositivo al abogado y suspende la operación privada.⟧
⟦TIME|21:25⟧
Narración: Poco después. Bar de jazz vacío.
Narración: Roman expone los documentos sobre su plan para acercarse a ti.
Narración: Entrega su dispositivo al abogado y suspende la operación privada.
Roman: “Te echaba de menos. Pero empecé todo esto con una mentira.”
⟦FREE⟧
Narración: Próxima escena: Marquesina bajo la lluvia.

# SCENE｜Marquesina bajo la lluvia
⟦BG|bg_b_c09s03|Marquesina bajo la lluvia；Personajes presentes：Tú, Roman；Acción：Rechaza la propuesta de sus empleados de reanudar el seguimiento. Un mensajero llega con una pista de la contraseña del disco.⟧
⟦TIME|21:50⟧
Narración: Poco después. Marquesina bajo la lluvia.
Narración: Rechaza la propuesta de sus empleados de reanudar el seguimiento.
Narración: Un mensajero llega con una pista de la contraseña del disco.
Roman: “Puedo dejar de contactar contigo y seguir entregando los documentos.”
⟦FREE⟧
⟦SET|b_c09_event⟧

# CHOICE｜¿Cuánto de su ternura estaba planeado?
#### A｜Exigir que cese todo acercamiento privado
Narración: Se revoca el plan de contacto.
⟦OPT|A|set:b_c09_a⟧
#### B｜Permitir el intercambio de pruebas mediante el abogado
Narración: La investigación continúa sin intimidad.
⟦OPT|B|set:b_c09_b⟧
#### C｜Escuchar sin prometer confianza
Narración: El plan de acercamiento íntegro se entrega al abogado.
⟦OPT|C|set:b_c09_c⟧
# ·
Narración: ¿Cuánto de su ternura estaba planeado?

# CHAPTER 10｜Fuera de su sombra
⟦GOAL|Comprender lo ocurrido en «Fuera de su sombra» y decidir el siguiente paso.|Fuera de su sombra⟧
⟦DONE|flag|b_c10_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Fuera de su sombra», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Laboratorio de datos independiente
⟦BG|bg_b_c10s01|Laboratorio de datos independiente；Personajes presentes：Tú, Nadia；Acción：El disco muestra que Roman se opuso a ciertas transacciones ilícitas, pero facilitó una red de blanqueo de capitales.⟧
⟦TIME|08:30⟧
Narración: La mañana del noveno día. Laboratorio de datos independiente.
⟦IF|b_c09_a⟧
Narración: Se revoca el plan de contacto.
⟦/IF⟧
⟦IF|b_c09_b⟧
Narración: La investigación continúa sin intimidad.
⟦/IF⟧
⟦IF|b_c09_c⟧
Narración: El plan de acercamiento íntegro se entrega al abogado.
⟦/IF⟧
Narración: El disco muestra que Roman se opuso a ciertas transacciones ilícitas, pero facilitó una red de blanqueo de capitales.
Nadia: “Haberse opuesto a algo no lo convierte en inocente.”
⟦FREE⟧
Narración: Próxima escena: Entrada del nuevo apartamento.

# SCENE｜Entrada del nuevo apartamento
⟦BG|bg_b_c10s02|Entrada del nuevo apartamento；Personajes presentes：Tú, Nadia；Acción：Has alquilado una vivienda por tu cuenta. Aparecen granos de café y una nota de advertencia ante la nueva puerta.⟧
⟦TIME|08:55⟧
Narración: Poco después. Entrada del nuevo apartamento.
Narración: Has alquilado una vivienda por tu cuenta.
Narración: Aparecen granos de café y una nota de advertencia ante la nueva puerta.
Nadia: “Quien lo envió sabía la dirección. Comprobemos los datos de la entrega.”
⟦FREE⟧
Narración: Próxima escena: Mesita junto a la ventana.

# SCENE｜Mesita junto a la ventana
⟦BG|bg_b_c10s03|Mesita junto a la ventana；Personajes presentes：Tú, Nadia；Acción：En una disculpa breve, Roman ofrece sus registros de vigilancia a los investigadores. Una furgoneta de reparto vuelve a rodear la manzana.⟧
⟦TIME|09:20⟧
Narración: Poco después. Mesita junto a la ventana.
Narración: En una disculpa breve, Roman ofrece sus registros de vigilancia a los investigadores.
Narración: Una furgoneta de reparto vuelve a rodear la manzana.
Nadia: “No tenemos que adivinar. Podemos documentar lo ocurrido.”
⟦FREE⟧
⟦SET|b_c10_event⟧

# CHOICE｜¿Por qué espera la lista de citas de Luca que lleves un libro contable?
#### A｜Comunicar el vehículo desconocido a las autoridades competentes
Narración: Sus datos quedan registrados independientemente.
⟦OPT|A|set:b_c10_a⟧
#### B｜Pedir al equipo de Roman una explicación del envío
Narración: Se aportan los registros para revisarlos.
⟦OPT|B|set:b_c10_b⟧
#### C｜Preguntar a Luca si compartió tu dirección
Narración: Su respuesta se conserva para contrastarla.
⟦OPT|C|set:b_c10_c⟧
# ·
Narración: ¿Por qué espera la lista de citas de Luca que lleves un libro contable?

# CHAPTER 11｜Tu hermano te usó como cebo
⟦GOAL|Comprender lo ocurrido en «Tu hermano te usó como cebo» y decidir el siguiente paso.|Tu hermano te usó como cebo⟧
⟦DONE|flag|b_c11_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Tu hermano te usó como cebo», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Redacción independiente
⟦BG|bg_b_c11s01|Redacción independiente；Personajes presentes：Tú, Nadia；Acción：Una reserva utiliza tu nombre real para reunirse con un antiguo contacto criminal. La nota dice que la hermana de Luca llevará el libro contable.⟧
⟦TIME|17:00⟧
Narración: La tarde del décimo día. Redacción independiente.
⟦IF|b_c10_a⟧
Narración: Sus datos quedan registrados independientemente.
⟦/IF⟧
⟦IF|b_c10_b⟧
Narración: Se aportan los registros para revisarlos.
⟦/IF⟧
⟦IF|b_c10_c⟧
Narración: Su respuesta se conserva para contrastarla.
⟦/IF⟧
Narración: Una reserva utiliza tu nombre real para reunirse con un antiguo contacto criminal.
Narración: La nota dice que la hermana de Luca llevará el libro contable.
Nadia: “Te puso en la lista sin preguntarte.”
⟦FREE⟧
Narración: Próxima escena: Viejo almacén del puerto.

# SCENE｜Viejo almacén del puerto
⟦BG|bg_b_c11s02|Viejo almacén del puerto；Personajes presentes：Tú, Luca；Acción：Al ver la reserva, Luca admite que quería atraer a Roman. Roman permanece al otro lado del puente sin intervenir.⟧
⟦TIME|17:25⟧
Narración: Poco después. Viejo almacén del puerto.
Narración: Al ver la reserva, Luca admite que quería atraer a Roman.
Narración: Roman permanece al otro lado del puente sin intervenir.
Luca: “Pensé que vendría si estabas allí.”
⟦FREE⟧
Narración: Próxima escena: Oficina del piso superior.

# SCENE｜Oficina del piso superior
⟦BG|bg_b_c11s03|Oficina del piso superior；Personajes presentes：Tú, Luca；Acción：Una grabación revela que Luca hizo filtrar tu itinerario. Sabía que podía haber una recompensa por ti y apostó a que Roman te rescataría.⟧
⟦TIME|17:50⟧
Narración: Poco después. Oficina del piso superior.
Narración: Una grabación revela que Luca hizo filtrar tu itinerario.
Narración: Sabía que podía haber una recompensa por ti y apostó a que Roman te rescataría.
Luca: “Me convencí de que nunca dejaría que te pasara nada.”
⟦FREE⟧
⟦SET|b_c11_event⟧

# CHOICE｜¿Quién está dispuesto a respetar tu negativa?
#### A｜Exigir que Luca deje de usar tu nombre
Narración: Se cancela la cita no autorizada.
⟦OPT|A|set:b_c11_a⟧
#### B｜Entregar la grabación a los investigadores
Narración: La implicación de Luca queda registrada formalmente.
⟦OPT|B|set:b_c11_b⟧
#### C｜Suspender el contacto con ambos
Narración: El abogado tramita las declaraciones de forma independiente.
⟦OPT|C|set:b_c11_c⟧
# ·
Narración: ¿Quién está dispuesto a respetar tu negativa?

# CHAPTER 12｜Una investigación propia
⟦GOAL|Comprender lo ocurrido en «Una investigación propia» y decidir el siguiente paso.|Una investigación propia⟧
⟦DONE|flag|b_c12_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Una investigación propia», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Pasarela del puerto
⟦BG|bg_b_c12s01|Pasarela del puerto；Personajes presentes：Tú, Nadia；Acción：Roman sigue al otro lado. Luca espera cerca. Llega el coche de un periodista y ninguno de los dos controla la investigación.⟧
⟦TIME|09:30⟧
Narración: La mañana del undécimo día. Pasarela del puerto.
⟦IF|b_c11_a⟧
Narración: Se cancela la cita no autorizada.
⟦/IF⟧
⟦IF|b_c11_b⟧
Narración: La implicación de Luca queda registrada formalmente.
⟦/IF⟧
⟦IF|b_c11_c⟧
Narración: El abogado tramita las declaraciones de forma independiente.
⟦/IF⟧
Narración: Roman sigue al otro lado.
Narración: Luca espera cerca.
Narración: Llega el coche de un periodista y ninguno de los dos controla la investigación.
Nadia: “Podemos decidir adónde van los documentos sin ellos.”
⟦FREE⟧
Narración: Próxima escena: Sala de auditoría externa.

# SCENE｜Sala de auditoría externa
⟦BG|bg_b_c12s02|Sala de auditoría externa；Personajes presentes：Tú, Nadia；Acción：El contraste demuestra que otro alto cargo emitió la orden letal. Un registro de seguros vincula a Roman con el encubrimiento posterior.⟧
⟦TIME|09:55⟧
Narración: Poco después. Sala de auditoría externa.
Narración: El contraste demuestra que otro alto cargo emitió la orden letal.
Narración: Un registro de seguros vincula a Roman con el encubrimiento posterior.
Nadia: “Él no firmó esa orden, pero estas pruebas sí lo implican.”
⟦FREE⟧
Narración: Próxima escena: Sala de reuniones del abogado.

# SCENE｜Sala de reuniones del abogado
⟦BG|bg_b_c12s03|Sala de reuniones del abogado；Personajes presentes：Tú, Roman；Acción：Roman entrega copias financieras que revelan sus propios delitos. El abogado explica que no podrá retirar la entrega por su cuenta.⟧
⟦TIME|10:20⟧
Narración: Poco después. Sala de reuniones del abogado.
Narración: Roman entrega copias financieras que revelan sus propios delitos.
Narración: El abogado explica que no podrá retirar la entrega por su cuenta.
Roman: “Inclúyelo en el expediente. Todo.”
⟦FREE⟧
⟦SET|b_c12_event⟧

# CHOICE｜¿El libro que entregó Roman también provocará cargos contra él?
#### A｜Proteger a las víctimas y entregar el libro íntegro
Narración: Los investigadores reciben las pruebas con medidas de privacidad.
⟦OPT|A|set:b_c12_a⟧
#### B｜Relatar tu experiencia sin declarar culpable a nadie
Narración: El relato verificado llega al periodista.
⟦OPT|B|set:b_c12_b⟧
#### C｜Conservar los originales para su examen pericial
Narración: Los registros permanecen intactos hasta la verificación formal.
⟦OPT|C|set:b_c12_c⟧
# ·
Narración: ¿El libro que entregó Roman también provocará cargos contra él?

# CHAPTER 13｜El testimonio del diablo
⟦GOAL|Comprender lo ocurrido en «El testimonio del diablo» y decidir el siguiente paso.|El testimonio del diablo⟧
⟦DONE|flag|b_c13_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «El testimonio del diablo», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Archivo de medios independiente
⟦BG|bg_b_c13s01|Archivo de medios independiente；Personajes presentes：Tú, Nadia；Acción：Se duplican los originales verificados y se prepara su entrega. Un mensaje anónimo amenaza al club si se presentan las pruebas.⟧
⟦TIME|10:00⟧
Narración: La mañana del duodécimo día. Archivo de medios independiente.
⟦IF|b_c12_a⟧
Narración: Los investigadores reciben las pruebas con medidas de privacidad.
⟦/IF⟧
⟦IF|b_c12_b⟧
Narración: El relato verificado llega al periodista.
⟦/IF⟧
⟦IF|b_c12_c⟧
Narración: Los registros permanecen intactos hasta la verificación formal.
⟦/IF⟧
Narración: Se duplican los originales verificados y se prepara su entrega.
Narración: Un mensaje anónimo amenaza al club si se presentan las pruebas.
Nadia: “La amenaza forma parte del caso, no es motivo para destruir los registros.”
⟦FREE⟧
Narración: Próxima escena: Centro de asistencia jurídica.

# SCENE｜Centro de asistencia jurídica
⟦BG|bg_b_c13s02|Centro de asistencia jurídica；Personajes presentes：Tú, Roman；Acción：Roman firma una declaración completa que admite la vigilancia y la destrucción de pruebas. Entrega las llaves del club a una administración independiente.⟧
⟦TIME|10:25⟧
Narración: Poco después. Centro de asistencia jurídica.
Narración: Roman firma una declaración completa que admite la vigilancia y la destrucción de pruebas.
Narración: Entrega las llaves del club a una administración independiente.
Roman: “Responderé de lo que hice.”
⟦FREE⟧
Narración: Próxima escena: Pista de baile vacía.

# SCENE｜Pista de baile vacía
⟦BG|bg_b_c13s03|Pista de baile vacía；Personajes presentes：Tú, Roman；Acción：La música ha dejado de sonar. Deja la tarjeta de acceso original sobre la mesa, sin intentar tocarte.⟧
⟦TIME|10:50⟧
Narración: Poco después. Pista de baile vacía.
Narración: La música ha dejado de sonar.
Narración: Deja la tarjeta de acceso original sobre la mesa, sin intentar tocarte.
Roman: “No tengo derecho a pedirte que me lo pongas más fácil.”
⟦FREE⟧
⟦SET|b_c13_event⟧

# CHOICE｜¿Puede asumir su responsabilidad sin convertirla en moneda de cambio?
#### A｜Exigir que cumpla con su responsabilidad
Narración: Cede el control del club mediante los procedimientos formales.
⟦OPT|A|set:b_c13_a⟧
#### B｜Expresar sentimientos contradictorios sin perdonarlo
Narración: Acepta la ambigüedad sin interpretarla como absolución.
⟦OPT|B|set:b_c13_b⟧
#### C｜Limitar toda comunicación a cauces legales
Narración: El abogado documenta las restricciones.
⟦OPT|C|set:b_c13_c⟧
# ·
Narración: ¿Puede asumir su responsabilidad sin convertirla en moneda de cambio?

# CHAPTER 14｜La última persecución
⟦GOAL|Comprender lo ocurrido en «La última persecución» y decidir el siguiente paso.|La última persecución⟧
⟦DONE|flag|b_c14_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La última persecución», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Callejón del club
⟦BG|bg_b_c14s01|Callejón del club；Personajes presentes：Tú, Nadia；Acción：Los bomberos aseguran la zona tras descubrirse una amenaza. Roman permanece detrás del cordón de seguridad para declarar.⟧
⟦TIME|04:30⟧
Narración: A primera hora del decimotercer día. Callejón del club.
⟦IF|b_c13_a⟧
Narración: Cede el control del club mediante los procedimientos formales.
⟦/IF⟧
⟦IF|b_c13_b⟧
Narración: Acepta la ambigüedad sin interpretarla como absolución.
⟦/IF⟧
⟦IF|b_c13_c⟧
Narración: El abogado documenta las restricciones.
⟦/IF⟧
Narración: Los bomberos aseguran la zona tras descubrirse una amenaza.
Narración: Roman permanece detrás del cordón de seguridad para declarar.
Nadia: “Se están ocupando del lugar. Mantente fuera del cordón.”
⟦FREE⟧
Narración: Próxima escena: Centro independiente de copias.

# SCENE｜Centro independiente de copias
⟦BG|bg_b_c14s02|Centro independiente de copias；Personajes presentes：Tú, Nadia；Acción：Se comprueban tres copias independientes. Se identifica al firmante que faltaba: un alto cargo de la antigua organización.⟧
⟦TIME|04:55⟧
Narración: Poco después. Centro independiente de copias.
Narración: Se comprueban tres copias independientes.
Narración: Se identifica al firmante que faltaba: un alto cargo de la antigua organización.
Nadia: “Los registros coinciden. Ya no pueden hacer desaparecer el original sin dejar rastro.”
⟦FREE⟧
Narración: Próxima escena: Sala de interrogatorios del puerto.

# SCENE｜Sala de interrogatorios del puerto
⟦BG|bg_b_c14s03|Sala de interrogatorios del puerto；Personajes presentes：Tú, Luca；Acción：Luca entrega registros del uso que hizo de tus datos. Roman declara por separado. Los nombres de ambos figuran en el expediente.⟧
⟦TIME|05:20⟧
Narración: Poco después. Sala de interrogatorios del puerto.
Narración: Luca entrega registros del uso que hizo de tus datos.
Narración: Roman declara por separado.
Narración: Los nombres de ambos figuran en el expediente.
Luca: “Usé tu nombre. Tengo que contarles exactamente lo que hice.”
⟦FREE⟧
⟦SET|b_c14_event⟧

# CHOICE｜¿Quién responderá ahora que los registros han sobrevivido?
#### A｜Priorizar la evacuación y preservar las pruebas
Narración: Se asegura la zona y se conservan los registros.
⟦OPT|A|set:b_c14_a⟧
#### B｜Entregar las copias por vías formales
Narración: Las pruebas siguen disponibles aunque un lugar resulte afectado.
⟦OPT|B|set:b_c14_b⟧
#### C｜Exigir que Luca aclare las responsabilidades omitidas
Narración: Su declaración adicional se incorpora a la investigación.
⟦OPT|C|set:b_c14_c⟧
# ·
Narración: ¿Quién responderá ahora que los registros han sobrevivido?

# CHAPTER 15｜Un libro de cuentas que sobrevivió
⟦GOAL|Comprender lo ocurrido en «Un libro de cuentas que sobrevivió» y decidir el siguiente paso.|Un libro de cuentas que sobrevivió⟧
⟦DONE|flag|b_c15_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Un libro de cuentas que sobrevivió», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Oficina de investigación independiente
⟦BG|bg_b_c15s01|Oficina de investigación independiente；Personajes presentes：Tú, Nadia；Acción：Los investigadores reciben el libro, los registros de llamadas y el material de vigilancia. Te entregan un aviso de privacidad y un recibo.⟧
⟦TIME|11:00⟧
Narración: La mañana del decimocuarto día. Oficina de investigación independiente.
⟦IF|b_c14_a⟧
Narración: Se asegura la zona y se conservan los registros.
⟦/IF⟧
⟦IF|b_c14_b⟧
Narración: Las pruebas siguen disponibles aunque un lugar resulte afectado.
⟦/IF⟧
⟦IF|b_c14_c⟧
Narración: Su declaración adicional se incorpora a la investigación.
⟦/IF⟧
Narración: Los investigadores reciben el libro, los registros de llamadas y el material de vigilancia.
Narración: Te entregan un aviso de privacidad y un recibo.
Nadia: “Tienes constancia independiente de lo que se entregó.”
⟦FREE⟧
Narración: Próxima escena: Banco del pasillo del hospital.

# SCENE｜Banco del pasillo del hospital
⟦BG|bg_b_c15s02|Banco del pasillo del hospital；Personajes presentes：Tú, Luca；Acción：En su declaración, Luca admite que fingió su propia muerte y decidió utilizarte para atraer a Roman. No pide perdón.⟧
⟦TIME|11:25⟧
Narración: Poco después. Banco del pasillo del hospital.
Narración: En su declaración, Luca admite que fingió su propia muerte y decidió utilizarte para atraer a Roman.
Narración: No pide perdón.
Luca: “No me debes ninguna respuesta.”
⟦FREE⟧
Narración: Próxima escena: Librería independiente.

# SCENE｜Librería independiente
⟦BG|bg_b_c15s03|Librería independiente；Personajes presentes：Tú, Nadia；Acción：El abogado de Roman envía una declaración adicional y una disculpa que no requiere respuesta. Alguien lee tu libro de fotografías.⟧
⟦TIME|11:50⟧
Narración: Poco después. Librería independiente.
Narración: El abogado de Roman envía una declaración adicional y una disculpa que no requiere respuesta.
Narración: Alguien lee tu libro de fotografías.
Nadia: “Tu obra sigue siendo tuya. ¿Qué quieres que sepa la gente?”
⟦FREE⟧
⟦SET|b_c15_event⟧

# CHOICE｜¿Qué costaría amar a un hombre culpable? ¿Quieres pagar ese precio?
#### A｜Comunicar solo que se entregaron las pruebas
Narración: Se informa del caso sin detalles privados de las relaciones.
⟦OPT|A|set:b_c15_a⟧
#### B｜Contar tu experiencia a través de la fotografía
Narración: La exposición refleja tu perspectiva.
⟦OPT|B|set:b_c15_b⟧
#### C｜Guardar silencio y recuperar la vida cotidiana
Narración: Tu privacidad se respeta mientras avanza el caso.
⟦OPT|C|set:b_c15_c⟧
# ·
Narración: ¿Qué costaría amar a un hombre culpable? ¿Quieres pagar ese precio?

# CHAPTER 16｜La puerta que abres tú
⟦GOAL|Comprender lo ocurrido en «La puerta que abres tú» y decidir el siguiente paso.|La puerta que abres tú⟧
⟦DONE|flag|b_c16_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La puerta que abres tú», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Galería fotográfica de barrio
⟦BG|bg_b_c16s01|Galería fotográfica de barrio；Personajes presentes：Tú, Responsable de la galería；Acción：Meses después, la exposición muestra tus propias fotografías, no retratos de ninguno de los dos hombres. Un abogado espera en la entrada.⟧
⟦TIME|10:30⟧
Narración: Varios meses después. Galería fotográfica de barrio.
⟦IF|b_c15_a⟧
Narración: Se informa del caso sin detalles privados de las relaciones.
⟦/IF⟧
⟦IF|b_c15_b⟧
Narración: La exposición refleja tu perspectiva.
⟦/IF⟧
⟦IF|b_c15_c⟧
Narración: Tu privacidad se respeta mientras avanza el caso.
⟦/IF⟧
Narración: Meses después, la exposición muestra tus propias fotografías, no retratos de ninguno de los dos hombres.
Narración: Un abogado espera en la entrada.
Responsable de la galería: “La exposición puede llevar solo tu nombre.”
⟦FREE⟧
Narración: Próxima escena: Salón tranquilo de la galería.

# SCENE｜Salón tranquilo de la galería
⟦BG|bg_b_c16s02|Salón tranquilo de la galería；Personajes presentes：Tú, Nadia；Acción：Una carta de Roman informa del caso y promete no investigar tu vida privada sin permiso. No solicita respuesta.⟧
⟦TIME|10:55⟧
Narración: Poco después. Salón tranquilo de la galería.
Narración: Una carta de Roman informa del caso y promete no investigar tu vida privada sin permiso.
Narración: No solicita respuesta.
Nadia: “Puedes dejar la carta sin contestar.”
⟦FREE⟧
Narración: Próxima escena: Calle de la ciudad por la mañana.

# SCENE｜Calle de la ciudad por la mañana
⟦BG|bg_b_c16s03|Calle de la ciudad por la mañana；Personajes presentes：Tú；Acción：La gente compra flores y corre hacia el tren. La ciudad sigue su ritmo, sin avisos de seguimiento. Tienes la cámara en la mano.⟧
⟦TIME|11:20⟧
Narración: Poco después. Calle de la ciudad por la mañana.
Narración: La gente compra flores y corre hacia el tren.
Narración: La ciudad sigue su ritmo, sin avisos de seguimiento.
Narración: Tienes la cámara en la mano.
Narración: Puedes decidir qué viene después o dejar la cuestión abierta.
⟦FREE⟧
⟦SET|b_c16_event⟧

# CHOICE｜Nadie más elige hacia dónde apuntas la cámara.
#### A｜Permitir expresamente una posible relación futura dentro de límites legales y seguros
Narración: Cualquier contacto futuro exige consentimiento claro y permiso legal aplicable.
⟦OPT|A|set:b_c16_a⟧
#### B｜Cerrar la posibilidad romántica y mantener solo el contacto necesario
Narración: Solo se transmite información imprescindible por los cauces adecuados.
⟦OPT|B|set:b_c16_b⟧
#### C｜Elegir un futuro independiente o aplazar la decisión
Narración: Tu vida sigue sin ningún compromiso romántico.
⟦OPT|C|set:b_c16_c⟧
# ·
Narración: Nadie más elige hacia dónde apuntas la cámara.

