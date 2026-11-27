# CHAPTER 1｜La puerta que no debías abrir
⟦GOAL|Comprender lo ocurrido en «La puerta que no debías abrir» y decidir el siguiente paso.|La puerta que no debías abrir⟧
⟦DONE|flag|a_c01_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La puerta que no debías abrir», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Pasillo de la finca de la boda
⟦BG|bg_a_c01s01|Pasillo de la finca de la boda；Personajes presentes：Tú, Ethan, Claire；Acción：Mientras se proyectan las fotos del compromiso, Ethan besa a una mujer vestida de dorado. Al verte, la estrecha contra él. La mujer deja caer un pendiente con el escudo de la familia.⟧
⟦TIME|22:30⟧
Narración: La víspera de la boda. Pasillo de la finca de la boda.
Narración: Mientras se proyectan las fotos del compromiso, Ethan besa a una mujer vestida de dorado.
Narración: Al verte, la estrecha contra él.
Narración: La mujer deja caer un pendiente con el escudo de la familia.
Ethan: “Vas a buscar a mi hermano, ¿verdad?”
⟦FREE⟧
Narración: Próxima escena: Habitación de Damian.

# SCENE｜Habitación de Damian
⟦BG|bg_a_c01s02|Habitación de Damian；Personajes presentes：Tú, Damian；Acción：Damian abre la puerta con el botón que le prestaste hace tres años en la mano. Deja la puerta sin echar la llave. Tu nombre aparece marcado con un círculo en el plano de mesas de mañana.⟧
⟦TIME|22:55⟧
Narración: Poco después. Habitación de Damian.
Narración: Damian abre la puerta con el botón que le prestaste hace tres años en la mano.
Narración: Deja la puerta sin echar la llave.
Narración: Tu nombre aparece marcado con un círculo en el plano de mesas de mañana.
Damian: “Me pediste que no usara tu nombre real. Ahora casi no me atrevo a pronunciarlo.”
⟦FREE⟧
Narración: Próxima escena: Biblioteca familiar.

# SCENE｜Biblioteca familiar
⟦BG|bg_a_c01s03|Biblioteca familiar；Personajes presentes：Tú, Damian；Acción：Te muestra una foto de ambos junto a la máquina expendedora del hospital. En el reverso reconoces la letra de Ethan. Se oyen unos pasos que se detienen al otro lado de la puerta.⟧
⟦TIME|23:20⟧
Narración: Poco después. Biblioteca familiar.
Narración: Te muestra una foto de ambos junto a la máquina expendedora del hospital.
Narración: En el reverso reconoces la letra de Ethan.
Narración: Se oyen unos pasos que se detienen al otro lado de la puerta.
Damian: “¿Quieres ver el original o que te cuente lo de aquella noche?”
⟦FREE⟧
⟦SET|a_c01_event⟧

# CHOICE｜¿Quién convirtió aquella noche en moneda de cambio?
#### A｜Pedir el original y una explicación
Narración: Damian deja a tu disposición el álbum y los negativos.
⟦OPT|A|set:a_c01_a⟧
#### B｜Enfrentarse a Ethan con una copia
Narración: Ethan ya no puede negar que sabía de la existencia de la foto.
⟦OPT|B|set:a_c01_b⟧
#### C｜Guardar la prueba y apartarse
Narración: No respondes a ninguno de los hermanos y conservas la prueba.
⟦OPT|C|set:a_c01_c⟧
# ·
Narración: ¿Quién convirtió aquella noche en moneda de cambio?

# CHAPTER 2｜La trampa del prometido
⟦GOAL|Comprender lo ocurrido en «La trampa del prometido» y decidir el siguiente paso.|La trampa del prometido⟧
⟦DONE|flag|a_c02_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La trampa del prometido», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Comedor
⟦BG|bg_a_c02s01|Comedor；Personajes presentes：Tú, Ethan；Acción：Faltan tres horas para la ceremonia. Ethan te acerca un café. Bajo el posavasos está la tarjeta de embarque de la mujer de dorado.⟧
⟦TIME|07:00⟧
Narración: A la mañana siguiente. Comedor.
⟦IF|a_c01_a⟧
Narración: Damian deja a tu disposición el álbum y los negativos.
⟦/IF⟧
⟦IF|a_c01_b⟧
Narración: Ethan ya no puede negar que sabía de la existencia de la foto.
⟦/IF⟧
⟦IF|a_c01_c⟧
Narración: No respondes a ninguno de los hermanos y conservas la prueba.
⟦/IF⟧
Narración: Faltan tres horas para la ceremonia.
Narración: Ethan te acerca un café.
Narración: Bajo el posavasos está la tarjeta de embarque de la mujer de dorado.
Ethan: “No dejes que un solo beso decida lo que pasa entre nosotros.”
⟦FREE⟧
Narración: Próxima escena: Terraza de la finca.

# SCENE｜Terraza de la finca
⟦BG|bg_a_c02s02|Terraza de la finca；Personajes presentes：Tú, Damian；Acción：Damian deja una caja de anillo en la barandilla. Dentro está el viejo tique del aparcamiento del hospital. Deja su abrigo cerca, sin tocarte.⟧
⟦TIME|07:25⟧
Narración: Poco después. Terraza de la finca.
Narración: Damian deja una caja de anillo en la barandilla.
Narración: Dentro está el viejo tique del aparcamiento del hospital.
Narración: Deja su abrigo cerca, sin tocarte.
Damian: “Recuerdo que se te rompió un tacón y aun así insististe en llevar a aquel hombre a urgencias.”
⟦FREE⟧
Narración: Próxima escena: Despacho de la organizadora.

# SCENE｜Despacho de la organizadora
⟦BG|bg_a_c02s03|Despacho de la organizadora；Personajes presentes：Tú, Ethan；Acción：Una tableta muestra fugazmente la foto de la noche de lluvia. Ethan apaga la pantalla. La impresora expulsa una autorización prematrimonial con tu nombre.⟧
⟦TIME|07:50⟧
Narración: Poco después. Despacho de la organizadora.
Narración: Una tableta muestra fugazmente la foto de la noche de lluvia.
Narración: Ethan apaga la pantalla.
Narración: La impresora expulsa una autorización prematrimonial con tu nombre.
Ethan: “Puedo detener la proyección. ¿Qué quieres que te explique primero?”
⟦FREE⟧
⟦SET|a_c02_event⟧

# CHOICE｜¿Por qué aparece el nombre de tu estudio en un documento de boda?
#### A｜Exigir que retiren la proyección
Narración: La organizadora conserva la lista anterior como prueba.
⟦OPT|A|set:a_c02_a⟧
#### B｜Enviar los documentos a un abogado independiente
Narración: Los recibe antes de la ceremonia.
⟦OPT|B|set:a_c02_b⟧
#### C｜Suspender el ensayo y avisar a una amiga
Narración: La amiga presencia la interrupción de los preparativos.
⟦OPT|C|set:a_c02_c⟧
# ·
Narración: ¿Por qué aparece el nombre de tu estudio en un documento de boda?

# CHAPTER 3｜Silencio en el altar
⟦GOAL|Comprender lo ocurrido en «Silencio en el altar» y decidir el siguiente paso.|Silencio en el altar⟧
⟦DONE|flag|a_c03_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Silencio en el altar», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Salón de bodas
⟦BG|bg_a_c03s01|Salón de bodas；Personajes presentes：Tú, Ethan；Acción：Los invitados se levantan al sonar las cuerdas. La pantalla presenta tus diseños inéditos como un lanzamiento comercial conjunto. Damian aparece con un grueso contrato.⟧
⟦TIME|10:00⟧
Narración: A la hora prevista de la ceremonia. Salón de bodas.
⟦IF|a_c02_a⟧
Narración: La organizadora conserva la lista anterior como prueba.
⟦/IF⟧
⟦IF|a_c02_b⟧
Narración: Los recibe antes de la ceremonia.
⟦/IF⟧
⟦IF|a_c02_c⟧
Narración: La amiga presencia la interrupción de los preparativos.
⟦/IF⟧
Narración: Los invitados se levantan al sonar las cuerdas.
Narración: La pantalla presenta tus diseños inéditos como un lanzamiento comercial conjunto.
Narración: Damian aparece con un grueso contrato.
Ethan: “Eso no debía salir hasta después de los votos.”
⟦FREE⟧
Narración: Próxima escena: Sala lateral de la capilla.

# SCENE｜Sala lateral de la capilla
⟦BG|bg_a_c03s02|Sala lateral de la capilla；Personajes presentes：Tú, Damian；Acción：El contrato transfiere los ingresos por licencias de tu estudio. Damian protege la puerta de las cámaras y se aparta.⟧
⟦TIME|10:25⟧
Narración: Poco después. Sala lateral de la capilla.
Narración: El contrato transfiere los ingresos por licencias de tu estudio.
Narración: Damian protege la puerta de las cámaras y se aparta.
Damian: “Puedes marcharte. No tienes por qué fingir ante nadie.”
⟦FREE⟧
Narración: Próxima escena: Sala de reuniones.

# SCENE｜Sala de reuniones
⟦BG|bg_a_c03s03|Sala de reuniones；Personajes presentes：Tú, Eleanor；Acción：La ceremonia queda suspendida. Eleanor anuncia ante ambas familias que congela los pagos de la colaboración, sin perder la sonrisa.⟧
⟦TIME|10:50⟧
Narración: Poco después. Sala de reuniones.
Narración: La ceremonia queda suspendida.
Narración: Eleanor anuncia ante ambas familias que congela los pagos de la colaboración, sin perder la sonrisa.
Eleanor: “Una relación comercial exige estabilidad. Seguro que lo entiendes.”
⟦FREE⟧
⟦SET|a_c03_event⟧

# CHOICE｜¿Qué intentará arrebatarte la familia por haberte negado?
#### A｜Anunciar la suspensión y pedir una investigación
Narración: Los invitados son testigos y se conservan las pruebas.
⟦OPT|A|set:a_c03_a⟧
#### B｜Entregar los documentos al abogado
Narración: El original queda custodiado de forma independiente.
⟦OPT|B|set:a_c03_b⟧
#### C｜Exigir explicaciones a Ethan ante los invitados
Narración: Debe responder públicamente por la proyección.
⟦OPT|C|set:a_c03_c⟧
# ·
Narración: ¿Qué intentará arrebatarte la familia por haberte negado?

# CHAPTER 4｜Quién paga el precio
⟦GOAL|Comprender lo ocurrido en «Quién paga el precio» y decidir el siguiente paso.|Quién paga el precio⟧
⟦DONE|flag|a_c04_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Quién paga el precio», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Oficina provisional del estudio
⟦BG|bg_a_c04s01|Oficina provisional del estudio；Personajes presentes：Tú, Mia；Acción：Hay bocetos en las paredes. El mayor cliente ha cancelado, los fondos están congelados y Mia teme por las nóminas.⟧
⟦TIME|15:30⟧
Narración: Esa tarde. Oficina provisional del estudio.
⟦IF|a_c03_a⟧
Narración: Los invitados son testigos y se conservan las pruebas.
⟦/IF⟧
⟦IF|a_c03_b⟧
Narración: El original queda custodiado de forma independiente.
⟦/IF⟧
⟦IF|a_c03_c⟧
Narración: Debe responder públicamente por la proyección.
⟦/IF⟧
Narración: Hay bocetos en las paredes.
Narración: El mayor cliente ha cancelado, los fondos están congelados y Mia teme por las nóminas.
Mia: “Podemos seguir trabajando, pero necesitamos un plan para el viernes.”
⟦FREE⟧
Narración: Próxima escena: Bufete independiente.

# SCENE｜Bufete independiente
⟦BG|bg_a_c04s02|Bufete independiente；Personajes presentes：Tú, Damian；Acción：Damian entrega al abogado actas antiguas y registros de pagos. Adjunta sus datos de contacto como parte de las pruebas, no como declaración de amor.⟧
⟦TIME|15:55⟧
Narración: Poco después. Bufete independiente.
Narración: Damian entrega al abogado actas antiguas y registros de pagos.
Narración: Adjunta sus datos de contacto como parte de las pruebas, no como declaración de amor.
Damian: “Lee cada página. No te fíes solo de mi palabra.”
⟦FREE⟧
Narración: Próxima escena: Zona de prensa del hotel.

# SCENE｜Zona de prensa del hotel
⟦BG|bg_a_c04s03|Zona de prensa del hotel；Personajes presentes：Tú, Mia；Acción：Los periodistas rodean una foto filtrada de los dos. Todavía se distingue la marca de agua del sistema de invitados.⟧
⟦TIME|16:20⟧
Narración: Poco después. Zona de prensa del hotel.
Narración: Los periodistas rodean una foto filtrada de los dos.
Narración: Todavía se distingue la marca de agua del sistema de invitados.
Mia: “Han convertido nuestro trabajo en un cotilleo. ¿Cómo respondemos?”
⟦FREE⟧
⟦SET|a_c04_event⟧

# CHOICE｜¿Quién filtró la foto desde el sistema de la boda?
#### A｜Proteger las nóminas y los pedidos
Narración: El equipo recibe un plan de contingencia.
⟦OPT|A|set:a_c04_a⟧
#### B｜Pedir la conservación legal de los registros
Narración: El abogado prepara medidas ajenas a la familia.
⟦OPT|B|set:a_c04_b⟧
#### C｜Hablar con la prensa sin mencionar el romance
Narración: Tu versión separa el conflicto empresarial de tu vida privada.
⟦OPT|C|set:a_c04_c⟧
# ·
Narración: ¿Quién filtró la foto desde el sistema de la boda?

# CHAPTER 5｜La cena prohibida
⟦GOAL|Comprender lo ocurrido en «La cena prohibida» y decidir el siguiente paso.|La cena prohibida⟧
⟦DONE|flag|a_c05_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La cena prohibida», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Comedor familiar
⟦BG|bg_a_c05s01|Comedor familiar；Personajes presentes：Tú, Eleanor；Acción：Eleanor pretende que Ethan anuncie que la boda solo se aplazó por una discusión. Damian retira el cartel del heredero y se sienta a tu lado.⟧
⟦TIME|20:00⟧
Narración: Esa noche. Comedor familiar.
⟦IF|a_c04_a⟧
Narración: El equipo recibe un plan de contingencia.
⟦/IF⟧
⟦IF|a_c04_b⟧
Narración: El abogado prepara medidas ajenas a la familia.
⟦/IF⟧
⟦IF|a_c04_c⟧
Narración: Tu versión separa el conflicto empresarial de tu vida privada.
⟦/IF⟧
Narración: Eleanor pretende que Ethan anuncie que la boda solo se aplazó por una discusión.
Narración: Damian retira el cartel del heredero y se sienta a tu lado.
Eleanor: “Todos esperan una declaración tranquilizadora.”
⟦FREE⟧
Narración: Próxima escena: Terraza nocturna.

# SCENE｜Terraza nocturna
⟦BG|bg_a_c05s02|Terraza nocturna；Personajes presentes：Tú, Damian；Acción：Deja unos zapatos planos sobre la mesa, recordando el tacón roto. Su mano descansa abierta sobre la mesa, no sobre la tuya.⟧
⟦TIME|20:25⟧
Narración: Poco después. Terraza nocturna.
Narración: Deja unos zapatos planos sobre la mesa, recordando el tacón roto.
Narración: Su mano descansa abierta sobre la mesa, no sobre la tuya.
Damian: “Dijiste que odiabas que te trataran como un trofeo. Debí escucharte antes.”
⟦FREE⟧
Narración: Próxima escena: Galería acristalada.

# SCENE｜Galería acristalada
⟦BG|bg_a_c05s03|Galería acristalada；Personajes presentes：Tú, Damian；Acción：Una cuenta anónima envía una foto tomada hace instantes. Amenaza con publicar a medianoche la historia de una novia robada.⟧
⟦TIME|20:50⟧
Narración: Poco después. Galería acristalada.
Narración: Una cuenta anónima envía una foto tomada hace instantes.
Narración: Amenaza con publicar a medianoche la historia de una novia robada.
Damian: “No voy a tocar tu móvil. Dime qué quieres hacer con esto.”
⟦FREE⟧
⟦SET|a_c05_event⟧

# CHOICE｜¿Quién vigila tus momentos privados?
#### A｜Hablar de tus sentimientos sin renunciar a la verdad
Narración: Damian reconoce la atracción sin dar por hecho el perdón.
⟦OPT|A|set:a_c05_a⟧
#### B｜Investigar primero la filtración
Narración: Se conserva la imagen y se busca su origen.
⟦OPT|B|set:a_c05_b⟧
#### C｜Rechazar la intimidad por ahora
Narración: Damian mantiene la distancia y habla solo de las pruebas.
⟦OPT|C|set:a_c05_c⟧
# ·
Narración: ¿Quién vigila tus momentos privados?

# CHAPTER 6｜Su voto decisivo
⟦GOAL|Comprender lo ocurrido en «Su voto decisivo» y decidir el siguiente paso.|Su voto decisivo⟧
⟦DONE|flag|a_c06_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Su voto decisivo», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Archivo familiar
⟦BG|bg_a_c06s01|Archivo familiar；Personajes presentes：Tú, Damian；Acción：Un acta de hace tres años detalla el plan para controlar las alianzas de tu estudio. El voto decisivo fue el de Damian.⟧
⟦TIME|21:30⟧
Narración: El tercer día tras la boda. Archivo familiar.
⟦IF|a_c05_a⟧
Narración: Damian reconoce la atracción sin dar por hecho el perdón.
⟦/IF⟧
⟦IF|a_c05_b⟧
Narración: Se conserva la imagen y se busca su origen.
⟦/IF⟧
⟦IF|a_c05_c⟧
Narración: Damian mantiene la distancia y habla solo de las pruebas.
⟦/IF⟧
Narración: Un acta de hace tres años detalla el plan para controlar las alianzas de tu estudio.
Narración: El voto decisivo fue el de Damian.
Damian: “Sí. Es mi firma. Sabía lo que significaba aquella propuesta.”
⟦FREE⟧
Narración: Próxima escena: Garaje subterráneo.

# SCENE｜Garaje subterráneo
⟦BG|bg_a_c06s02|Garaje subterráneo；Personajes presentes：Tú, Damian；Acción：La lluvia gotea de su abrigo mientras se quita la insignia del consejo. La deja a tu alcance.⟧
⟦TIME|21:55⟧
Narración: Poco después. Garaje subterráneo.
Narración: La lluvia gotea de su abrigo mientras se quita la insignia del consejo.
Narración: La deja a tu alcance.
Damian: “Creí que conservando mi puesto podría arreglarlo después. Me equivoqué.”
⟦FREE⟧
Narración: Próxima escena: Entrada de la finca.

# SCENE｜Entrada de la finca
⟦BG|bg_a_c06s03|Entrada de la finca；Personajes presentes：Tú, Ethan；Acción：Ethan sostiene dos billetes de luna de miel y muestra un vídeo sin sonido de Damian firmando.⟧
⟦TIME|22:20⟧
Narración: Poco después. Entrada de la finca.
Narración: Ethan sostiene dos billetes de luna de miel y muestra un vídeo sin sonido de Damian firmando.
Ethan: “Lo sabía antes de que te pidiera matrimonio. Pregúntale qué más sabía.”
⟦FREE⟧
⟦SET|a_c06_event⟧

# CHOICE｜¿Fue realmente casual vuestro primer encuentro?
#### A｜Exigir que Damian abandone su responsabilidad sobre el estudio
Narración: La renuncia se convierte en una condición de rendición de cuentas.
⟦OPT|A|set:a_c06_a⟧
#### B｜Pedir una admisión pública
Narración: Su participación queda documentada.
⟦OPT|B|set:a_c06_b⟧
#### C｜Suspender conversaciones privadas e investigar por tu cuenta
Narración: La investigación sale del control familiar.
⟦OPT|C|set:a_c06_c⟧
# ·
Narración: ¿Fue realmente casual vuestro primer encuentro?

# CHAPTER 7｜Un nombre bajo la lluvia
⟦GOAL|Comprender lo ocurrido en «Un nombre bajo la lluvia» y decidir el siguiente paso.|Un nombre bajo la lluvia⟧
⟦DONE|flag|a_c07_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Un nombre bajo la lluvia», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Vestíbulo del antiguo hotel
⟦BG|bg_a_c07s01|Vestíbulo del antiguo hotel；Personajes presentes：Tú, Damian；Acción：Aún cuelgan fotos del rescate. El gerente reconoce la imagen de tu tacón roto.⟧
⟦TIME|14:00⟧
Narración: Al día siguiente. Vestíbulo del antiguo hotel.
⟦IF|a_c06_a⟧
Narración: La renuncia se convierte en una condición de rendición de cuentas.
⟦/IF⟧
⟦IF|a_c06_b⟧
Narración: Su participación queda documentada.
⟦/IF⟧
⟦IF|a_c06_c⟧
Narración: La investigación sale del control familiar.
⟦/IF⟧
Narración: Aún cuelgan fotos del rescate.
Narración: El gerente reconoce la imagen de tu tacón roto.
Damian: “Aquella noche no estuvo planeada. Lo que vino después, sí.”
⟦FREE⟧
Narración: Próxima escena: Escalera del hotel.

# SCENE｜Escalera del hotel
⟦BG|bg_a_c07s02|Escalera del hotel；Personajes presentes：Tú, Damian；Acción：Recuerda el bocadillo frío que compartisteis y tu alias, June. Sonríe un instante antes de recordar el voto.⟧
⟦TIME|14:25⟧
Narración: Poco después. Escalera del hotel.
Narración: Recuerda el bocadillo frío que compartisteis y tu alias, June.
Narración: Sonríe un instante antes de recordar el voto.
Damian: “Recordé a June mucho después de conocer tu nombre verdadero.”
⟦FREE⟧
Narración: Próxima escena: Sala de vigilancia.

# SCENE｜Sala de vigilancia
⟦BG|bg_a_c07s03|Sala de vigilancia；Personajes presentes：Tú, Damian；Acción：El archivo fue exportado una semana antes de la pedida mediante la cuenta administrativa familiar. En el vídeo antiguo brilla un pendiente de perla.⟧
⟦TIME|14:50⟧
Narración: Poco después. Sala de vigilancia.
Narración: El archivo fue exportado una semana antes de la pedida mediante la cuenta administrativa familiar.
Narración: En el vídeo antiguo brilla un pendiente de perla.
Damian: “Alguien nos buscó. Tenemos que averiguar quién.”
⟦FREE⟧
⟦SET|a_c07_event⟧

# CHOICE｜¿Quién llevaba los pendientes de perlas?
#### A｜Localizar al conductor al que ayudaste
Narración: Se identifica a un testigo del encuentro.
⟦OPT|A|set:a_c07_a⟧
#### B｜Rastrear la cuenta administrativa
Narración: Los registros de acceso pasan a ser una pista clave.
⟦OPT|B|set:a_c07_b⟧
#### C｜Pedir todos los registros de Damian
Narración: Su versión puede contrastarse con pruebas independientes.
⟦OPT|C|set:a_c07_c⟧
# ·
Narración: ¿Quién llevaba los pendientes de perlas?

# CHAPTER 8｜La infidelidad era un montaje
⟦GOAL|Comprender lo ocurrido en «La infidelidad era un montaje» y decidir el siguiente paso.|La infidelidad era un montaje⟧
⟦DONE|flag|a_c08_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La infidelidad era un montaje», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Estudio fotográfico privado
⟦BG|bg_a_c08s01|Estudio fotográfico privado；Personajes presentes：Tú, Claire；Acción：Claire, la mujer de dorado, deja un contrato sobre la mesa. Ethan la contrató para fingir ser su amante. Está furiosa por el uso de las imágenes.⟧
⟦TIME|16:00⟧
Narración: Más tarde ese día. Estudio fotográfico privado.
⟦IF|a_c07_a⟧
Narración: Se identifica a un testigo del encuentro.
⟦/IF⟧
⟦IF|a_c07_b⟧
Narración: Los registros de acceso pasan a ser una pista clave.
⟦/IF⟧
⟦IF|a_c07_c⟧
Narración: Su versión puede contrastarse con pruebas independientes.
⟦/IF⟧
Narración: Claire, la mujer de dorado, deja un contrato sobre la mesa.
Narración: Ethan la contrató para fingir ser su amante.
Narración: Está furiosa por el uso de las imágenes.
Claire: “Me contrataron para actuar, no para destrozarte la vida.”
⟦FREE⟧
Narración: Próxima escena: Despacho de Ethan.

# SCENE｜Despacho de Ethan
⟦BG|bg_a_c08s02|Despacho de Ethan；Personajes presentes：Tú, Ethan；Acción：Muestra disculpas sin terminar y el vídeo del voto de su hermano. Intenta alcanzarte la manga, pero se detiene.⟧
⟦TIME|16:25⟧
Narración: Poco después. Despacho de Ethan.
Narración: Muestra disculpas sin terminar y el vídeo del voto de su hermano.
Narración: Intenta alcanzarte la manga, pero se detiene.
Ethan: “Quería que me eligieras. Y acabé provocando lo peor.”
⟦FREE⟧
Narración: Próxima escena: Sala de proyección.

# SCENE｜Sala de proyección
⟦BG|bg_a_c08s03|Sala de proyección；Personajes presentes：Tú, Ethan；Acción：El vídeo muestra solo el voto favorable de Damian. Los metadatos revelan que se editó ayer.⟧
⟦TIME|16:50⟧
Narración: Poco después. Sala de proyección.
Narración: El vídeo muestra solo el voto favorable de Damian.
Narración: Los metadatos revelan que se editó ayer.
Ethan: “La grabación completa sigue aquí. Te la daré.”
⟦FREE⟧
⟦SET|a_c08_event⟧

# CHOICE｜¿Quién editó el vídeo y por qué ahora?
#### A｜Exigir que Ethan admita públicamente el montaje
Narración: El contrato de Claire respalda una rectificación.
⟦OPT|A|set:a_c08_a⟧
#### B｜Conservar el vídeo sin editar
Narración: El original queda disponible para una revisión independiente.
⟦OPT|B|set:a_c08_b⟧
#### C｜Rechazar otro intento de provocar celos
Narración: Ethan pierde el montaje como pretexto para verte a solas.
⟦OPT|C|set:a_c08_c⟧
# ·
Narración: ¿Quién editó el vídeo y por qué ahora?

# CHAPTER 9｜El precio de un beso
⟦GOAL|Comprender lo ocurrido en «El precio de un beso» y decidir el siguiente paso.|El precio de un beso⟧
⟦DONE|flag|a_c09_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «El precio de un beso», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜estudio fotográfico
⟦BG|bg_a_c09s01|estudio fotográfico；Personajes presentes：Tú, Ethan；Acción：Circulan fotos de la terraza con un titular que te acusa de casarte por dinero. El equipo protege a los modelos de las cámaras.⟧
⟦TIME|11:00⟧
Narración: A la mañana siguiente. estudio fotográfico.
⟦IF|a_c08_a⟧
Narración: El contrato de Claire respalda una rectificación.
⟦/IF⟧
⟦IF|a_c08_b⟧
Narración: El original queda disponible para una revisión independiente.
⟦/IF⟧
⟦IF|a_c08_c⟧
Narración: Ethan pierde el montaje como pretexto para verte a solas.
⟦/IF⟧
Narración: Circulan fotos de la terraza con un titular que te acusa de casarte por dinero.
Narración: El equipo protege a los modelos de las cámaras.
Ethan: “No pensé que fueran a atacar también a quienes trabajan contigo.”
⟦FREE⟧
Narración: Próxima escena: Despacho de Damian.

# SCENE｜Despacho de Damian
⟦BG|bg_a_c09s02|Despacho de Damian；Personajes presentes：Tú, Damian；Acción：Cierra un correo de prensa sin enviar, deja el móvil y entrega sus actas anotadas.⟧
⟦TIME|11:25⟧
Narración: Poco después. Despacho de Damian.
Narración: Cierra un correo de prensa sin enviar, deja el móvil y entrega sus actas anotadas.
Damian: “Tú decides cómo responder. Aquí tienes el documento original.”
⟦FREE⟧
Narración: Próxima escena: Estudio de emisión independiente.

# SCENE｜Estudio de emisión independiente
⟦BG|bg_a_c09s03|Estudio de emisión independiente；Personajes presentes：Tú, Mia；Acción：Ningún hermano aparece ante la cámara. Un comentario anónimo menciona perlas y confesiones. El abogado confirma la implicación del servidor nupcial.⟧
⟦TIME|11:50⟧
Narración: Poco después. Estudio de emisión independiente.
Narración: Ningún hermano aparece ante la cámara.
Narración: Un comentario anónimo menciona perlas y confesiones.
Narración: El abogado confirma la implicación del servidor nupcial.
Mia: “Podemos aclarar lo ocurrido sin exponer tu vida privada.”
⟦FREE⟧
⟦SET|a_c09_event⟧

# CHOICE｜¿Quién utilizó el servidor de la boda para atacarte?
#### A｜Explicar la suspensión con tus propias palabras
Narración: El público recibe tu versión, no la familiar.
⟦OPT|A|set:a_c09_a⟧
#### B｜Conservar los registros del servidor y proceder legalmente
Narración: Las pruebas técnicas quedan a disposición del abogado.
⟦OPT|B|set:a_c09_b⟧
#### C｜Hablar solo de los derechos de tu obra
Narración: Los detalles de la relación siguen siendo privados.
⟦OPT|C|set:a_c09_c⟧
# ·
Narración: ¿Quién utilizó el servidor de la boda para atacarte?

# CHAPTER 10｜La rivalidad del hermano menor
⟦GOAL|Comprender lo ocurrido en «La rivalidad del hermano menor» y decidir el siguiente paso.|La rivalidad del hermano menor⟧
⟦DONE|flag|a_c10_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La rivalidad del hermano menor», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Sala de billar
⟦BG|bg_a_c10s01|Sala de billar；Personajes presentes：Tú, Ethan；Acción：Ethan sostiene el taco al revés y admite que odiaba que lo compararan con su hermano.⟧
⟦TIME|15:00⟧
Narración: El sexto día. Sala de billar.
⟦IF|a_c09_a⟧
Narración: El público recibe tu versión, no la familiar.
⟦/IF⟧
⟦IF|a_c09_b⟧
Narración: Las pruebas técnicas quedan a disposición del abogado.
⟦/IF⟧
⟦IF|a_c09_c⟧
Narración: Los detalles de la relación siguen siendo privados.
⟦/IF⟧
Narración: Ethan sostiene el taco al revés y admite que odiaba que lo compararan con su hermano.
Ethan: “Quería ganar. Dejé de preguntarme si te haría daño.”
⟦FREE⟧
Narración: Próxima escena: Sala de control del sistema nupcial.

# SCENE｜Sala de control del sistema nupcial
⟦BG|bg_a_c10s02|Sala de control del sistema nupcial；Personajes presentes：Tú, Ethan；Acción：La oficina administrativa familiar subió el vídeo oculto. El dispositivo de exportación pertenece a la secretaria de Eleanor.⟧
⟦TIME|15:25⟧
Narración: Poco después. Sala de control del sistema nupcial.
Narración: La oficina administrativa familiar subió el vídeo oculto.
Narración: El dispositivo de exportación pertenece a la secretaria de Eleanor.
Ethan: “Esa es la cuenta. No puedo fingir que no contribuí a esto.”
⟦FREE⟧
Narración: Próxima escena: Salón de té de Eleanor.

# SCENE｜Salón de té de Eleanor
⟦BG|bg_a_c10s03|Salón de té de Eleanor；Personajes presentes：Tú, Eleanor；Acción：Ethan se enfrenta a su madre, que remueve el té con calma ante el registro de exportación.⟧
⟦TIME|15:50⟧
Narración: Poco después. Salón de té de Eleanor.
Narración: Ethan se enfrenta a su madre, que remueve el té con calma ante el registro de exportación.
Eleanor: “Las familias protegen sus intereses. Tu estudio formaba parte de los nuestros.”
⟦FREE⟧
⟦SET|a_c10_event⟧

# CHOICE｜¿Qué quería adquirir Eleanor mediante la boda?
#### A｜Exigir una disculpa formal a ti y al equipo
Narración: Ethan debe reconocer el daño causado.
⟦OPT|A|set:a_c10_a⟧
#### B｜Encargar una auditoría independiente
Narración: Los registros se revisan fuera de la familia.
⟦OPT|B|set:a_c10_b⟧
#### C｜Enfrentarse a Eleanor con el registro
Narración: Su versión se conserva para contrastarla con otras pruebas.
⟦OPT|C|set:a_c10_c⟧
# ·
Narración: ¿Qué quería adquirir Eleanor mediante la boda?

# CHAPTER 11｜El estudio que te arrebataron
⟦GOAL|Comprender lo ocurrido en «El estudio que te arrebataron» y decidir el siguiente paso.|El estudio que te arrebataron⟧
⟦DONE|flag|a_c11_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «El estudio que te arrebataron», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Archivador jurídico del estudio
⟦BG|bg_a_c11s01|Archivador jurídico del estudio；Personajes presentes：Tú, Mia；Acción：Una licencia perpetua escaneada lleva una firma que no es tuya y un sello antiguo destinado a una prueba limitada.⟧
⟦TIME|10:00⟧
Narración: El séptimo día. Archivador jurídico del estudio.
⟦IF|a_c10_a⟧
Narración: Ethan debe reconocer el daño causado.
⟦/IF⟧
⟦IF|a_c10_b⟧
Narración: Los registros se revisan fuera de la familia.
⟦/IF⟧
⟦IF|a_c10_c⟧
Narración: Su versión se conserva para contrastarla con otras pruebas.
⟦/IF⟧
Narración: Una licencia perpetua escaneada lleva una firma que no es tuya y un sello antiguo destinado a una prueba limitada.
Mia: “Ese sello nunca autorizó esto.”
⟦FREE⟧
Narración: Próxima escena: Despacho del consejo.

# SCENE｜Despacho del consejo
⟦BG|bg_a_c11s02|Despacho del consejo；Personajes presentes：Tú, Damian；Acción：Damian presenta una valoración secreta de tu empresa de hace tres años. El precio es insultantemente bajo.⟧
⟦TIME|10:25⟧
Narración: Poco después. Despacho del consejo.
Narración: Damian presenta una valoración secreta de tu empresa de hace tres años.
Narración: El precio es insultantemente bajo.
Damian: “Le pusieron precio antes de preguntarte. Dejé que ocurriera.”
⟦FREE⟧
Narración: Próxima escena: Mesas del estudio de madrugada.

# SCENE｜Mesas del estudio de madrugada
⟦BG|bg_a_c11s03|Mesas del estudio de madrugada；Personajes presentes：Tú, Mia；Acción：Los diseñadores ordenan bocetos, correos y prototipos por fecha. Un mensaje antiguo de un cliente evidencia interferencias en tu negocio.⟧
⟦TIME|10:50⟧
Narración: Poco después. Mesas del estudio de madrugada.
Narración: Los diseñadores ordenan bocetos, correos y prototipos por fecha.
Narración: Un mensaje antiguo de un cliente evidencia interferencias en tu negocio.
Mia: “Estos son nuestros originales. Podemos demostrar quién los creó.”
⟦FREE⟧
⟦SET|a_c11_event⟧

# CHOICE｜¿Desde cuándo planeaba la familia apropiarse de tu trabajo?
#### A｜Solicitar el cese de uso de tus diseños
Narración: El abogado prepara una reclamación independiente de derechos.
⟦OPT|A|set:a_c11_a⟧
#### B｜Organizar el archivo creativo con el equipo
Narración: Queda establecida la cronología de creación.
⟦OPT|B|set:a_c11_b⟧
#### C｜Exigir la valoración y el voto
Narración: La participación de Damian queda registrada, no excusada.
⟦OPT|C|set:a_c11_c⟧
# ·
Narración: ¿Desde cuándo planeaba la familia apropiarse de tu trabajo?

# CHAPTER 12｜Tus propias pruebas
⟦GOAL|Comprender lo ocurrido en «Tus propias pruebas» y decidir el siguiente paso.|Tus propias pruebas⟧
⟦DONE|flag|a_c12_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Tus propias pruebas», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Archivo del estudio
⟦BG|bg_a_c12s01|Archivo del estudio；Personajes presentes：Tú, Mia；Acción：Los registros originales coinciden con las fechas de la nube. El último testigo es la antigua organizadora de Ethan.⟧
⟦TIME|18:00⟧
Narración: El octavo día. Archivo del estudio.
⟦IF|a_c11_a⟧
Narración: El abogado prepara una reclamación independiente de derechos.
⟦/IF⟧
⟦IF|a_c11_b⟧
Narración: Queda establecida la cronología de creación.
⟦/IF⟧
⟦IF|a_c11_c⟧
Narración: La participación de Damian queda registrada, no excusada.
⟦/IF⟧
Narración: Los registros originales coinciden con las fechas de la nube.
Narración: El último testigo es la antigua organizadora de Ethan.
Mia: “Su relato no encaja con nuestros archivos. Esta es la cronología.”
⟦FREE⟧
Narración: Próxima escena: Archivo de la empresa de bodas.

# SCENE｜Archivo de la empresa de bodas
⟦BG|bg_a_c12s02|Archivo de la empresa de bodas；Personajes presentes：Tú, Ethan；Acción：Ethan entrega copias sin conexión. Damian aporta actas antiguas. Un correo ofrece retirar la demanda a cambio de que te cases.⟧
⟦TIME|18:25⟧
Narración: Poco después. Archivo de la empresa de bodas.
Narración: Ethan entrega copias sin conexión.
Narración: Damian aporta actas antiguas.
Narración: Un correo ofrece retirar la demanda a cambio de que te cases.
Ethan: “Firmé la autorización para montar aquella escena. No fue un accidente.”
⟦FREE⟧
Narración: Próxima escena: Suite privada de Eleanor.

# SCENE｜Suite privada de Eleanor
⟦BG|bg_a_c12s03|Suite privada de Eleanor；Personajes presentes：Tú, Eleanor；Acción：Junto al champán hay un acuerdo: retirar la demanda si reanudas la boda y concedes licencias adicionales.⟧
⟦TIME|18:50⟧
Narración: Poco después. Suite privada de Eleanor.
Narración: Junto al champán hay un acuerdo: retirar la demanda si reanudas la boda y concedes licencias adicionales.
Eleanor: “Una firma y se acabará todo este disgusto.”
⟦FREE⟧
⟦SET|a_c12_event⟧

# CHOICE｜¿Renunciará alguno de los hermanos al poder cuando le cueste algo?
#### A｜Rechazar la oferta y conservar el acuerdo
Narración: La propuesta de intercambio se convierte en prueba.
⟦OPT|A|set:a_c12_a⟧
#### B｜Exigir negociaciones formales a través del abogado
Narración: No se celebra un acuerdo matrimonial privado.
⟦OPT|B|set:a_c12_b⟧
#### C｜Incluir al equipo en las decisiones
Narración: Quienes crearon las obras tienen voz.
⟦OPT|C|set:a_c12_c⟧
# ·
Narración: ¿Renunciará alguno de los hermanos al poder cuando le cueste algo?

# CHAPTER 13｜El hombre que renuncia a la corona
⟦GOAL|Comprender lo ocurrido en «El hombre que renuncia a la corona» y decidir el siguiente paso.|El hombre que renuncia a la corona⟧
⟦DONE|flag|a_c13_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «El hombre que renuncia a la corona», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Sala de accionistas
⟦BG|bg_a_c13s01|Sala de accionistas；Personajes presentes：Tú, Damian；Acción：Damian reconoce públicamente su voto decisivo y abandona el puesto del consejo responsable de tu proyecto. Cambia el recuento.⟧
⟦TIME|11:00⟧
Narración: El noveno día. Sala de accionistas.
⟦IF|a_c12_a⟧
Narración: La propuesta de intercambio se convierte en prueba.
⟦/IF⟧
⟦IF|a_c12_b⟧
Narración: No se celebra un acuerdo matrimonial privado.
⟦/IF⟧
⟦IF|a_c12_c⟧
Narración: Quienes crearon las obras tienen voz.
⟦/IF⟧
Narración: Damian reconoce públicamente su voto decisivo y abandona el puesto del consejo responsable de tu proyecto.
Narración: Cambia el recuento.
Damian: “Voté a favor. No me esconderé detrás del apellido familiar.”
⟦FREE⟧
Narración: Próxima escena: Galería de accionistas.

# SCENE｜Galería de accionistas
⟦BG|bg_a_c13s02|Galería de accionistas；Personajes presentes：Tú, Ethan；Acción：Ethan admite ante testigos el beso fingido y la manipulación de la boda. Damian asiente desde lejos.⟧
⟦TIME|11:25⟧
Narración: Poco después. Galería de accionistas.
Narración: Ethan admite ante testigos el beso fingido y la manipulación de la boda.
Narración: Damian asiente desde lejos.
Ethan: “Lo hice por celos. Es una explicación, no una excusa.”
⟦FREE⟧
Narración: Próxima escena: Tribuna.

# SCENE｜Tribuna
⟦BG|bg_a_c13s03|Tribuna；Personajes presentes：Tú, Mia；Acción：El equipo presenta los registros originales de diseño. Los consejeros independientes piden una investigación. Eleanor saca la grabación de la noche de lluvia.⟧
⟦TIME|11:50⟧
Narración: Poco después. Tribuna.
Narración: El equipo presenta los registros originales de diseño.
Narración: Los consejeros independientes piden una investigación.
Narración: Eleanor saca la grabación de la noche de lluvia.
Mia: “Tiene otro vídeo. Veamos el original entero, no su versión.”
⟦FREE⟧
⟦SET|a_c13_event⟧

# CHOICE｜¿Qué ha ocultado Eleanor durante tres años?
#### A｜Separar la responsabilidad del romance
Narración: Ninguna admisión equivale al perdón.
⟦OPT|A|set:a_c13_a⟧
#### B｜Exigir el testimonio completo de Damian
Narración: Su declaración se incorpora a la investigación.
⟦OPT|B|set:a_c13_b⟧
#### C｜Mantener el foco en las obras del estudio
Narración: Las reclamaciones independientes del equipo siguen siendo centrales.
⟦OPT|C|set:a_c13_c⟧
# ·
Narración: ¿Qué ha ocultado Eleanor durante tres años?

# CHAPTER 14｜La jugada de la matriarca
⟦GOAL|Comprender lo ocurrido en «La jugada de la matriarca» y decidir el siguiente paso.|La jugada de la matriarca⟧
⟦DONE|flag|a_c14_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La jugada de la matriarca», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Despacho de Eleanor
⟦BG|bg_a_c14s01|Despacho de Eleanor；Personajes presentes：Tú, Eleanor；Acción：Reproduce el vídeo de aquella noche para insinuar un trato impropio. También se te ve esperando en urgencias. Faltan veinte segundos.⟧
⟦TIME|20:00⟧
Narración: Esa tarde. Despacho de Eleanor.
⟦IF|a_c13_a⟧
Narración: Ninguna admisión equivale al perdón.
⟦/IF⟧
⟦IF|a_c13_b⟧
Narración: Su declaración se incorpora a la investigación.
⟦/IF⟧
⟦IF|a_c13_c⟧
Narración: Las reclamaciones independientes del equipo siguen siendo centrales.
⟦/IF⟧
Narración: Reproduce el vídeo de aquella noche para insinuar un trato impropio.
Narración: También se te ve esperando en urgencias.
Narración: Faltan veinte segundos.
Eleanor: “La gente cree lo que ve.”
⟦FREE⟧
Narración: Próxima escena: Sala de consultas jurídicas.

# SCENE｜Sala de consultas jurídicas
⟦BG|bg_a_c14s02|Sala de consultas jurídicas；Personajes presentes：Tú, Damian；Acción：Damian declara que no impidió las vulneraciones de derechos. Una secretaria entrega los pagos del montaje firmados por Ethan.⟧
⟦TIME|20:25⟧
Narración: Poco después. Sala de consultas jurídicas.
Narración: Damian declara que no impidió las vulneraciones de derechos.
Narración: Una secretaria entrega los pagos del montaje firmados por Ethan.
Damian: “No borres mi nombre de la declaración.”
⟦FREE⟧
Narración: Próxima escena: Pasadizo del jardín.

# SCENE｜Pasadizo del jardín
⟦BG|bg_a_c14s03|Pasadizo del jardín；Personajes presentes：Tú, Ethan；Acción：Ethan te entrega una carpeta transparente con pruebas de su participación. Se ve claramente su firma.⟧
⟦TIME|20:50⟧
Narración: Poco después. Pasadizo del jardín.
Narración: Ethan te entrega una carpeta transparente con pruebas de su participación.
Narración: Se ve claramente su firma.
Ethan: “No puedo deshacer lo que hice. Puedes usar cada página.”
⟦FREE⟧
⟦SET|a_c14_event⟧

# CHOICE｜¿Podrá la verdad devolverte tu trabajo sin exigirte el corazón?
#### A｜Conservar la grabación completa
Narración: Se contrastan el original y la versión editada.
⟦OPT|A|set:a_c14_a⟧
#### B｜Rechazar el matrimonio como condición del acuerdo
Narración: Eleanor no obtiene el compromiso privado.
⟦OPT|B|set:a_c14_b⟧
#### C｜Exigir declaraciones separadas de ambos hermanos
Narración: Sus relatos quedan registrados independientemente.
⟦OPT|C|set:a_c14_c⟧
# ·
Narración: ¿Podrá la verdad devolverte tu trabajo sin exigirte el corazón?

# CHAPTER 15｜Nadie responde por ti
⟦GOAL|Comprender lo ocurrido en «Nadie responde por ti» y decidir el siguiente paso.|Nadie responde por ti⟧
⟦DONE|flag|a_c15_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Nadie responde por ti», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Sala de revisión independiente
⟦BG|bg_a_c15s01|Sala de revisión independiente；Personajes presentes：Tú, Mia；Acción：La investigación preliminar relaciona las autorizaciones falsificadas con los pagos congelados. Continúan los procedimientos y aparecen nuevos clientes.⟧
⟦TIME|17:00⟧
Narración: Una semana después. Sala de revisión independiente.
⟦IF|a_c14_a⟧
Narración: Se contrastan el original y la versión editada.
⟦/IF⟧
⟦IF|a_c14_b⟧
Narración: Eleanor no obtiene el compromiso privado.
⟦/IF⟧
⟦IF|a_c14_c⟧
Narración: Sus relatos quedan registrados independientemente.
⟦/IF⟧
Narración: La investigación preliminar relaciona las autorizaciones falsificadas con los pagos congelados.
Narración: Continúan los procedimientos y aparecen nuevos clientes.
Mia: “Esta vez los pedidos son reales. Podemos comprobarlos uno a uno.”
⟦FREE⟧
Narración: Próxima escena: Cafetería junto al río.

# SCENE｜Cafetería junto al río
⟦BG|bg_a_c15s02|Cafetería junto al río；Personajes presentes：Tú, Damian；Acción：Damian llega sin escoltas ni publicistas. Hay un café y una nota, sin flores ni anillo.⟧
⟦TIME|17:25⟧
Narración: Poco después. Cafetería junto al río.
Narración: Damian llega sin escoltas ni publicistas.
Narración: Hay un café y una nota, sin flores ni anillo.
Damian: “Me gustaría empezar despacio, si algún día te apetece.”
⟦FREE⟧
Narración: Próxima escena: Jardín nupcial vacío.

# SCENE｜Jardín nupcial vacío
⟦BG|bg_a_c15s03|Jardín nupcial vacío；Personajes presentes：Tú, Ethan；Acción：Retiran las sillas blancas. La caja del anillo sigue cerrada. El estudio recibe la llamada de un posible cliente.⟧
⟦TIME|17:50⟧
Narración: Poco después. Jardín nupcial vacío.
Narración: Retiran las sillas blancas.
Narración: La caja del anillo sigue cerrada.
Narración: El estudio recibe la llamada de un posible cliente.
Ethan: “No tienes que decirme qué harás con el anillo.”
⟦FREE⟧
⟦SET|a_c15_event⟧

# CHOICE｜¿Qué relación elegirías sin la presión de la familia?
#### A｜Priorizar la reconstrucción del estudio
Narración: El equipo firma su primer pedido nuevo e independiente.
⟦OPT|A|set:a_c15_a⟧
#### B｜Permitir un encuentro público con Damian
Narración: Es posible verse de igual a igual sin prometer romance.
⟦OPT|B|set:a_c15_b⟧
#### C｜Rechazar el contacto privado con los dos
Narración: Se respetan los límites y tu vida continúa.
⟦OPT|C|set:a_c15_c⟧
# ·
Narración: ¿Qué relación elegirías sin la presión de la familia?

# CHAPTER 16｜La vida después de la boda
⟦GOAL|Comprender lo ocurrido en «La vida después de la boda» y decidir el siguiente paso.|La vida después de la boda⟧
⟦DONE|flag|a_c16_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La vida después de la boda», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Exposición del nuevo estudio
⟦BG|bg_a_c16s01|Exposición del nuevo estudio；Personajes presentes：Tú, Mia；Acción：Seis meses después, tu nombre preside la entrada y tus bocetos llenan las vitrinas. Damian está en la lista, pero espera fuera.⟧
⟦TIME|19:00⟧
Narración: Seis meses después. Exposición del nuevo estudio.
⟦IF|a_c15_a⟧
Narración: El equipo firma su primer pedido nuevo e independiente.
⟦/IF⟧
⟦IF|a_c15_b⟧
Narración: Es posible verse de igual a igual sin prometer romance.
⟦/IF⟧
⟦IF|a_c15_c⟧
Narración: Se respetan los límites y tu vida continúa.
⟦/IF⟧
Narración: Seis meses después, tu nombre preside la entrada y tus bocetos llenan las vitrinas.
Narración: Damian está en la lista, pero espera fuera.
Mia: “Ahora podemos revisar todos nuestros contratos.”
⟦FREE⟧
Narración: Próxima escena: Salón de la exposición.

# SCENE｜Salón de la exposición
⟦BG|bg_a_c16s02|Salón de la exposición；Personajes presentes：Tú, Damian；Acción：Trae un cuaderno en blanco como el de hace tres años. La disculpa de Ethan llega a través del abogado. Damian espera permiso para sentarse.⟧
⟦TIME|19:25⟧
Narración: Poco después. Salón de la exposición.
Narración: Trae un cuaderno en blanco como el de hace tres años.
Narración: La disculpa de Ethan llega a través del abogado.
Narración: Damian espera permiso para sentarse.
Damian: “No sé qué pasará entre nosotros. Lo que sí sé es que no voy a decidirlo por ti.”
⟦FREE⟧
Narración: Próxima escena: Paseo junto al río.

# SCENE｜Paseo junto al río
⟦BG|bg_a_c16s03|Paseo junto al río；Personajes presentes：Tú, Damian；Acción：Las luces se reflejan en el agua. Damian propone pasear sin dar por hecho que quieras compañía.⟧
⟦TIME|19:50⟧
Narración: Poco después. Paseo junto al río.
Narración: Las luces se reflejan en el agua.
Narración: Damian propone pasear sin dar por hecho que quieras compañía.
Damian: “Si te apetece, podemos empezar con un paseo. Si no, lo entiendo.”
⟦FREE⟧
⟦SET|a_c16_event⟧

# CHOICE｜La siguiente página te pertenece.
#### A｜Elegir explícitamente una relación igualitaria con Damian
Narración: Solo el consentimiento claro permite una primera cita; la responsabilidad continúa.
⟦OPT|A|set:a_c16_a⟧
#### B｜Dejar abierta la posibilidad de reconstruir la confianza con Ethan
Narración: Puede empezar de nuevo con actos honestos, sin reconciliación automática.
⟦OPT|B|set:a_c16_b⟧
#### C｜Elegir la independencia o aplazar la decisión
Narración: Tu vida está completa sin ningún compromiso romántico.
⟦OPT|C|set:a_c16_c⟧
# ·
Narración: La siguiente página te pertenece.

