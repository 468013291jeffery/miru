# CHAPTER 1｜Confesión a medianoche
⟦GOAL|Comprender lo ocurrido en «Confesión a medianoche» y decidir el siguiente paso.|Confesión a medianoche⟧
⟦DONE|flag|c_c01_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Confesión a medianoche», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Entrada del confesionario cerrado
⟦BG|bg_c_c01s01|Entrada del confesionario cerrado；Personajes presentes：Tú, Lucian；Acción：La campana da las doce. El agua brilla sobre las losas. Al otro lado de la celosía de madera, una llave toca la mesa.⟧
⟦TIME|00:00⟧
Narración: La primera noche. Entrada del confesionario cerrado.
Narración: La campana da las doce.
Narración: El agua brilla sobre las losas.
Narración: Al otro lado de la celosía de madera, una llave toca la mesa.
Lucian: “Has traído su fotografía, ¿verdad?”
⟦FREE⟧
Narración: Próxima escena: Celosía del confesionario.

# SCENE｜Celosía del confesionario
⟦BG|bg_c_c01s02|Celosía del confesionario；Personajes presentes：Tú, Lucian；Acción：Lucian describe el abrigo azul de Mara y el botón que le faltaba. Aprieta la madera hasta que se le blanquean los nudillos. Desliza una lámpara hacia ti.⟧
⟦TIME|00:25⟧
Narración: Poco después. Celosía del confesionario.
Narración: Lucian describe el abrigo azul de Mara y el botón que le faltaba.
Narración: Aprieta la madera hasta que se le blanquean los nudillos.
Narración: Desliza una lámpara hacia ti.
Lucian: “Recuerdo la noche en que cruzó aquella puerta.”
⟦FREE⟧
Narración: Próxima escena: Sala lateral de la capilla.

# SCENE｜Sala lateral de la capilla
⟦BG|bg_c_c01s03|Sala lateral de la capilla；Personajes presentes：Tú, Lucian；Acción：Deposita el rosario de tu madre y la llave del sótano. Un retrato muestra a una niña con tu bufanda roja de la infancia.⟧
⟦TIME|00:50⟧
Narración: Poco después. Sala lateral de la capilla.
Narración: Deposita el rosario de tu madre y la llave del sótano.
Narración: Un retrato muestra a una niña con tu bufanda roja de la infancia.
Lucian: “Yo le abrí la puerta. Vi cómo la cerraban desde fuera.”
⟦FREE⟧
⟦SET|c_c01_event⟧

# CHOICE｜¿Quién custodia la puerta que cerraron hace siete años?
#### A｜Exigir su versión sobre la puerta cerrada
Narración: Entrega su registro de guardia de aquella noche.
⟦OPT|A|set:c_c01_a⟧
#### B｜Guardar el rosario y verificar su origen
Narración: Se documenta su procedencia de forma independiente.
⟦OPT|B|set:c_c01_b⟧
#### C｜Rechazar su compañía y contactar con una investigadora
Narración: Nora recibe la información de la llave y el lugar.
⟦OPT|C|set:c_c01_c⟧
# ·
Narración: ¿Quién custodia la puerta que cerraron hace siete años?

# CHAPTER 2｜Ecos bajo la abadía
⟦GOAL|Comprender lo ocurrido en «Ecos bajo la abadía» y decidir el siguiente paso.|Ecos bajo la abadía⟧
⟦DONE|flag|c_c02_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Ecos bajo la abadía», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Pasillo del sótano
⟦BG|bg_c_c02s01|Pasillo del sótano；Personajes presentes：Tú, Lucian；Acción：Han borrado varios nombres del registro de visitas. En el margen hay una receta médica.⟧
⟦TIME|01:00⟧
Narración: Más tarde esa noche. Pasillo del sótano.
⟦IF|c_c01_a⟧
Narración: Entrega su registro de guardia de aquella noche.
⟦/IF⟧
⟦IF|c_c01_b⟧
Narración: Se documenta su procedencia de forma independiente.
⟦/IF⟧
⟦IF|c_c01_c⟧
Narración: Nora recibe la información de la llave y el lugar.
⟦/IF⟧
Narración: Han borrado varios nombres del registro de visitas.
Narración: En el margen hay una receta médica.
Lucian: “Alguien ha estado alterando estos registros.”
⟦FREE⟧
Narración: Próxima escena: Archivo subterráneo.

# SCENE｜Archivo subterráneo
⟦BG|bg_c_c02s02|Archivo subterráneo；Personajes presentes：Tú, Lucian；Acción：El armario contiene registros de medicación y un sobre sellado de aislamiento temporal. Hay una taza recién usada junto a un marco suelto.⟧
⟦TIME|01:25⟧
Narración: Poco después. Archivo subterráneo.
Narración: El armario contiene registros de medicación y un sobre sellado de aislamiento temporal.
Narración: Hay una taza recién usada junto a un marco suelto.
Lucian: “Alguien ha estado aquí esta noche.”
⟦FREE⟧
Narración: Próxima escena: Puerta oculta del sótano.

# SCENE｜Puerta oculta del sótano
⟦BG|bg_c_c02s03|Puerta oculta del sótano；Personajes presentes：Tú, Lucian；Acción：Detrás del marco hay un retrato familiar pintado por tu madre. La niña lleva tu bufanda roja. Un papel contiene siete fechas.⟧
⟦TIME|01:50⟧
Narración: Poco después. Puerta oculta del sótano.
Narración: Detrás del marco hay un retrato familiar pintado por tu madre.
Narración: La niña lleva tu bufanda roja.
Narración: Un papel contiene siete fechas.
Lucian: “No sé por qué está aquí tu retrato. Podemos averiguarlo.”
⟦FREE⟧
⟦SET|c_c02_event⟧

# CHOICE｜¿Quién te incluyó en el plan?
#### A｜Conservar el retrato y comprobar la letra
Narración: Se preserva la marca oculta de media luna.
⟦OPT|A|set:c_c02_a⟧
#### B｜Pedir a Lucian que documente lo que desconoce
Narración: Quedan registrados los límites de su conocimiento.
⟦OPT|B|set:c_c02_b⟧
#### C｜Pedir a Nora que examine los accesos recientes
Narración: Se investigan las visitas de forma independiente.
⟦OPT|C|set:c_c02_c⟧
# ·
Narración: ¿Quién te incluyó en el plan?

# CHAPTER 3｜Lluvia y antiguos votos
⟦GOAL|Comprender lo ocurrido en «Lluvia y antiguos votos» y decidir el siguiente paso.|Lluvia y antiguos votos⟧
⟦DONE|flag|c_c03_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Lluvia y antiguos votos», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Biblioteca bajo la tormenta
⟦BG|bg_c_c03s01|Biblioteca bajo la tormenta；Personajes presentes：Tú, Lucian；Acción：La lluvia golpea las vidrieras. Lucian se quita su antigua insignia y la guarda en un cajón sin llave.⟧
⟦TIME|22:00⟧
Narración: La segunda noche. Biblioteca bajo la tormenta.
⟦IF|c_c02_a⟧
Narración: Se preserva la marca oculta de media luna.
⟦/IF⟧
⟦IF|c_c02_b⟧
Narración: Quedan registrados los límites de su conocimiento.
⟦/IF⟧
⟦IF|c_c02_c⟧
Narración: Se investigan las visitas de forma independiente.
⟦/IF⟧
Narración: La lluvia golpea las vidrieras.
Narración: Lucian se quita su antigua insignia y la guarda en un cajón sin llave.
Lucian: “Dejé atrás aquella vida, pero eso no significa que haya asumido mi responsabilidad.”
⟦FREE⟧
Narración: Próxima escena: Mesa de lectura.

# SCENE｜Mesa de lectura
⟦BG|bg_c_c03s02|Mesa de lectura；Personajes presentes：Tú, Lucian；Acción：Sus dedos se detienen en el borde de la página. Te acerca un plano antiguo de la sala de internamiento. Un trueno lo hace proteger el diario de Mara.⟧
⟦TIME|22:25⟧
Narración: Poco después. Mesa de lectura.
Narración: Sus dedos se detienen en el borde de la página.
Narración: Te acerca un plano antiguo de la sala de internamiento.
Narración: Un trueno lo hace proteger el diario de Mara.
Lucian: “La habitación sigue allí. Aquí se indica dónde estaba.”
⟦FREE⟧
Narración: Próxima escena: Ventana de vidriera.

# SCENE｜Ventana de vidriera
⟦BG|bg_c_c03s03|Ventana de vidriera；Personajes presentes：Tú, Lucian；Acción：Un aviso prohíbe el alta. Nora te cuenta que aún quedan copias de las grabaciones antiguas, guardadas sin conexión a la red.⟧
⟦TIME|22:50⟧
Narración: Poco después. Ventana de vidriera.
Narración: Un aviso prohíbe el alta.
Narración: Nora te cuenta que aún quedan copias de las grabaciones antiguas, guardadas sin conexión a la red.
Lucian: “Quiero estar cerca de ti. Sé que esto importa más.”
⟦FREE⟧
⟦SET|c_c03_event⟧

# CHOICE｜¿Qué mostrarán las viejas grabaciones?
#### A｜Hablar de la atracción y exigir pruebas
Narración: Entrega el plano sin reclamar intimidad.
⟦OPT|A|set:c_c03_a⟧
#### B｜Centrar la conversación en Mara
Narración: Deja de hacer acercamientos personales y aporta hechos.
⟦OPT|B|set:c_c03_b⟧
#### C｜Preguntar si el deseo oculta su culpa
Narración: Reconoce que la cercanía no reduce su responsabilidad.
⟦OPT|C|set:c_c03_c⟧
# ·
Narración: ¿Qué mostrarán las viejas grabaciones?

# CHAPTER 4｜Ella no se marchó por voluntad propia
⟦GOAL|Comprender lo ocurrido en «Ella no se marchó por voluntad propia» y decidir el siguiente paso.|Ella no se marchó por voluntad propia⟧
⟦DONE|flag|c_c04_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Ella no se marchó por voluntad propia», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Archivo de vigilancia
⟦BG|bg_c_c04s01|Archivo de vigilancia；Personajes presentes：Tú, Nora；Acción：En un vídeo de hace siete años, unos auxiliares conducen a Mara a una sala cerrada. La fecha contradice el informe de ingreso voluntario.⟧
⟦TIME|11:00⟧
Narración: La mañana del tercer día. Archivo de vigilancia.
⟦IF|c_c03_a⟧
Narración: Entrega el plano sin reclamar intimidad.
⟦/IF⟧
⟦IF|c_c03_b⟧
Narración: Deja de hacer acercamientos personales y aporta hechos.
⟦/IF⟧
⟦IF|c_c03_c⟧
Narración: Reconoce que la cercanía no reduce su responsabilidad.
⟦/IF⟧
Narración: En un vídeo de hace siete años, unos auxiliares conducen a Mara a una sala cerrada.
Narración: La fecha contradice el informe de ingreso voluntario.
Nora: “Ahí está. El informe y el vídeo no pueden ser ciertos a la vez.”
⟦FREE⟧
Narración: Próxima escena: Antiguo pasillo médico.

# SCENE｜Antiguo pasillo médico
⟦BG|bg_c_c04s02|Antiguo pasillo médico；Personajes presentes：Tú, Lucian；Acción：Lucian admite que sabía que la puerta se cerraba desde fuera y no intervino. Su insignia de guardia queda guardada en una bolsa de pruebas.⟧
⟦TIME|11:25⟧
Narración: Poco después. Antiguo pasillo médico.
Narración: Lucian admite que sabía que la puerta se cerraba desde fuera y no intervino.
Narración: Su insignia de guardia queda guardada en una bolsa de pruebas.
Lucian: “Lo vi. No hice nada. Esa es la verdad.”
⟦FREE⟧
Narración: Próxima escena: Sala de reuniones jurídicas.

# SCENE｜Sala de reuniones jurídicas
⟦BG|bg_c_c04s03|Sala de reuniones jurídicas；Personajes presentes：Tú, Nora；Acción：Nora entrega el vídeo al abogado. Lucian redacta una declaración. El expediente médico menciona siete cartas que nunca se enviaron.⟧
⟦TIME|11:50⟧
Narración: Poco después. Sala de reuniones jurídicas.
Narración: Nora entrega el vídeo al abogado.
Narración: Lucian redacta una declaración.
Narración: El expediente médico menciona siete cartas que nunca se enviaron.
Nora: “Esas cartas quizá expliquen quién le impidió ponerse en contacto contigo.”
⟦FREE⟧
⟦SET|c_c04_event⟧

# CHOICE｜¿Qué más ocultó su silencio?
#### A｜Exigir que documente su presencia
Narración: Su versión queda registrada formalmente.
⟦OPT|A|set:c_c04_a⟧
#### B｜Investigar quién cerró la puerta y autorizó la orden
Narración: Se conservan los registros de la sala y del personal.
⟦OPT|B|set:c_c04_b⟧
#### C｜Suspender los encuentros privados con Lucian
Narración: Las pruebas se transmiten a través de Nora.
⟦OPT|C|set:c_c04_c⟧
# ·
Narración: ¿Qué más ocultó su silencio?

# CHAPTER 5｜Siete cartas sin enviar
⟦GOAL|Comprender lo ocurrido en «Siete cartas sin enviar» y decidir el siguiente paso.|Siete cartas sin enviar⟧
⟦DONE|flag|c_c05_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Siete cartas sin enviar», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Escalera del campanario
⟦BG|bg_c_c05s01|Escalera del campanario；Personajes presentes：Tú, Lucian；Acción：Una caja de hierro polvorienta contiene siete cartas selladas. Cada una lleva una media luna.⟧
⟦TIME|21:00⟧
Narración: La tercera noche. Escalera del campanario.
⟦IF|c_c04_a⟧
Narración: Su versión queda registrada formalmente.
⟦/IF⟧
⟦IF|c_c04_b⟧
Narración: Se conservan los registros de la sala y del personal.
⟦/IF⟧
⟦IF|c_c04_c⟧
Narración: Las pruebas se transmiten a través de Nora.
⟦/IF⟧
Narración: Una caja de hierro polvorienta contiene siete cartas selladas.
Narración: Cada una lleva una media luna.
Lucian: “Esos sellos no son los que usaba tu abuela.”
⟦FREE⟧
Narración: Próxima escena: Estante del campanario.

# SCENE｜Estante del campanario
⟦BG|bg_c_c05s02|Estante del campanario；Personajes presentes：Tú, Lucian；Acción：La sexta carta menciona al abogado de tu abuela. La séptima está rota. Debajo hay un anexo antiguo del testamento.⟧
⟦TIME|21:25⟧
Narración: Poco después. Estante del campanario.
Narración: La sexta carta menciona al abogado de tu abuela.
Narración: La séptima está rota.
Narración: Debajo hay un anexo antiguo del testamento.
Lucian: “Reconozco la letra de tu madre. Alguien impidió que te llegaran.”
⟦FREE⟧
Narración: Próxima escena: Ventana del campanario.

# SCENE｜Ventana del campanario
⟦BG|bg_c_c05s03|Ventana del campanario；Personajes presentes：Tú, Lucian；Acción：La condición de las siete noches parece añadida después imitando la caligrafía original. La carta rota menciona a Agnes.⟧
⟦TIME|21:50⟧
Narración: Poco después. Ventana del campanario.
Narración: La condición de las siete noches parece añadida después imitando la caligrafía original.
Narración: La carta rota menciona a Agnes.
Lucian: “No te quedes porque te lo ordene un trozo de papel.”
⟦FREE⟧
⟦SET|c_c05_event⟧

# CHOICE｜¿Quién diseñó la cuenta atrás de siete noches?
#### A｜Verificar el testamento original con el abogado
Narración: El documento añadido queda impugnado formalmente.
⟦OPT|A|set:c_c05_a⟧
#### B｜Reconstruir el orden de las cartas
Narración: La cronología revela que interceptaron la correspondencia.
⟦OPT|B|set:c_c05_b⟧
#### C｜Preguntar a Agnes por la condición añadida
Narración: Se registra su primera explicación.
⟦OPT|C|set:c_c05_c⟧
# ·
Narración: ¿Quién diseñó la cuenta atrás de siete noches?

# CHAPTER 6｜Los celos son más sinceros que una oración
⟦GOAL|Comprender lo ocurrido en «Los celos son más sinceros que una oración» y decidir el siguiente paso.|Los celos son más sinceros que una oración⟧
⟦DONE|flag|c_c06_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Los celos son más sinceros que una oración», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Claustro de la abadía
⟦BG|bg_c_c06s01|Claustro de la abadía；Personajes presentes：Tú, Nora；Acción：Nora llega con la copia de una declaración testimonial. Lucian se detiene a medio paso con el té.⟧
⟦TIME|15:00⟧
Narración: La tarde del cuarto día. Claustro de la abadía.
⟦IF|c_c05_a⟧
Narración: El documento añadido queda impugnado formalmente.
⟦/IF⟧
⟦IF|c_c05_b⟧
Narración: La cronología revela que interceptaron la correspondencia.
⟦/IF⟧
⟦IF|c_c05_c⟧
Narración: Se registra su primera explicación.
⟦/IF⟧
Narración: Nora llega con la copia de una declaración testimonial.
Narración: Lucian se detiene a medio paso con el té.
Nora: “La copia es posterior al hecho que describe.”
⟦FREE⟧
Narración: Próxima escena: Galería soleada del claustro.

# SCENE｜Galería soleada del claustro
⟦BG|bg_c_c06s02|Galería soleada del claustro；Personajes presentes：Tú, Lucian；Acción：Su nombre aparece parcialmente oculto. Admite envidiar la confianza que Nora se ha ganado, pero no interfiere.⟧
⟦TIME|15:25⟧
Narración: Poco después. Galería soleada del claustro.
Narración: Su nombre aparece parcialmente oculto.
Narración: Admite envidiar la confianza que Nora se ha ganado, pero no interfiere.
Lucian: “La envidio porque tienes motivos para confiar en ella. Yo te di motivos para desconfiar de mí.”
⟦FREE⟧
Narración: Próxima escena: Banco del patio.

# SCENE｜Banco del patio
⟦BG|bg_c_c06s03|Banco del patio；Personajes presentes：Tú, Nora；Acción：Las fibras de las páginas que faltan del registro coinciden con las de las cartas. Agnes observa desde el pasillo lejano.⟧
⟦TIME|15:50⟧
Narración: Poco después. Banco del patio.
Narración: Las fibras de las páginas que faltan del registro coinciden con las de las cartas.
Narración: Agnes observa desde el pasillo lejano.
Nora: “Alguien sustituyó una página. Necesitamos el original.”
⟦FREE⟧
⟦SET|c_c06_event⟧

# CHOICE｜¿Quién alteró la declaración de Lucian?
#### A｜Decir que la sinceridad es una condición de la cercanía
Narración: Admite haber firmado un registro y busca el original.
⟦OPT|A|set:c_c06_a⟧
#### B｜Exigir que separe los celos del caso
Narración: Sigue siendo testigo y no obstaculiza a Nora.
⟦OPT|B|set:c_c06_b⟧
#### C｜Rechazar el contacto privado y trabajar con Nora
Narración: Lucian aporta material a las horas acordadas.
⟦OPT|C|set:c_c06_c⟧
# ·
Narración: ¿Quién alteró la declaración de Lucian?

# CHAPTER 7｜El nombre bajo la cera
⟦GOAL|Comprender lo ocurrido en «El nombre bajo la cera» y decidir el siguiente paso.|El nombre bajo la cera⟧
⟦DONE|flag|c_c07_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «El nombre bajo la cera», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Archivo de sellos
⟦BG|bg_c_c07s01|Archivo de sellos；Personajes presentes：Tú, Lucian；Acción：Un recibo dentro de una carta refleja un pago de la abadía a un centro asistencial privado. Lucian reconoce la firma.⟧
⟦TIME|21:30⟧
Narración: La cuarta noche. Archivo de sellos.
⟦IF|c_c06_a⟧
Narración: Admite haber firmado un registro y busca el original.
⟦/IF⟧
⟦IF|c_c06_b⟧
Narración: Sigue siendo testigo y no obstaculiza a Nora.
⟦/IF⟧
⟦IF|c_c06_c⟧
Narración: Lucian aporta material a las horas acordadas.
⟦/IF⟧
Narración: Un recibo dentro de una carta refleja un pago de la abadía a un centro asistencial privado.
Narración: Lucian reconoce la firma.
Lucian: “Yo gestioné ese dinero. Creía que era para el tratamiento.”
⟦FREE⟧
Narración: Próxima escena: Oficina de contabilidad.

# SCENE｜Oficina de contabilidad
⟦BG|bg_c_c07s02|Oficina de contabilidad；Personajes presentes：Tú, Lucian；Acción：Recupera los registros de efectivo, incluida su propia firma, en lugar de ofrecer excusas.⟧
⟦TIME|21:55⟧
Narración: Poco después. Oficina de contabilidad.
Narración: Recupera los registros de efectivo, incluida su propia firma, en lugar de ofrecer excusas.
Lucian: “Aquí está el libro completo. No te quedes solo con mi explicación.”
⟦FREE⟧
Narración: Próxima escena: Pórtico nocturno.

# SCENE｜Pórtico nocturno
⟦BG|bg_c_c07s03|Pórtico nocturno；Personajes presentes：Tú, Agnes；Acción：Agnes pregunta amablemente si estás cómoda. En su llavero está la llave de la antigua sala de internamiento.⟧
⟦TIME|22:20⟧
Narración: Poco después. Pórtico nocturno.
Narración: Agnes pregunta amablemente si estás cómoda.
Narración: En su llavero está la llave de la antigua sala de internamiento.
Agnes: “Algunas puertas se cerraron por el bien de los pacientes.”
⟦FREE⟧
⟦SET|c_c07_event⟧

# CHOICE｜¿Fue Lucian testigo, partícipe o ambas cosas?
#### A｜Exigir todos los recibos y registros de pagos
Narración: La participación de Lucian queda documentada.
⟦OPT|A|set:c_c07_a⟧
#### B｜Pedir a Nora que rastree el pago de forma independiente
Narración: Se investigan las cuentas receptoras.
⟦OPT|B|set:c_c07_b⟧
#### C｜Preguntar a Agnes quién autorizó el pago
Narración: Se conserva su explicación para contrastarla.
⟦OPT|C|set:c_c07_c⟧
# ·
Narración: ¿Fue Lucian testigo, partícipe o ambas cosas?

# CHAPTER 8｜La trampa de las siete noches
⟦GOAL|Comprender lo ocurrido en «La trampa de las siete noches» y decidir el siguiente paso.|La trampa de las siete noches⟧
⟦DONE|flag|c_c08_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La trampa de las siete noches», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Despacho del abogado de tu abuela
⟦BG|bg_c_c08s01|Despacho del abogado de tu abuela；Personajes presentes：Tú, Nora；Acción：El testamento original no contiene la condición de las siete noches. El abogado entrega documentos para proteger la herencia.⟧
⟦TIME|09:00⟧
Narración: La mañana del quinto día. Despacho del abogado de tu abuela.
⟦IF|c_c07_a⟧
Narración: La participación de Lucian queda documentada.
⟦/IF⟧
⟦IF|c_c07_b⟧
Narración: Se investigan las cuentas receptoras.
⟦/IF⟧
⟦IF|c_c07_c⟧
Narración: Se conserva su explicación para contrastarla.
⟦/IF⟧
Narración: El testamento original no contiene la condición de las siete noches.
Narración: El abogado entrega documentos para proteger la herencia.
Nora: “Puedes marcharte. Esa condición no figuraba en el original.”
⟦FREE⟧
Narración: Próxima escena: Habitación de invitados.

# SCENE｜Habitación de invitados
⟦BG|bg_c_c08s02|Habitación de invitados；Personajes presentes：Tú, Nora；Acción：Los registros muestran que animaron a quedarse a otros visitantes que buscaban a Mara y luego les enviaron cartas para que dejaran de preguntar.⟧
⟦TIME|09:25⟧
Narración: Poco después. Habitación de invitados.
Narración: Los registros muestran que animaron a quedarse a otros visitantes que buscaban a Mara y luego les enviaron cartas para que dejaran de preguntar.
Nora: “Puedes investigar desde fuera de estos muros.”
⟦FREE⟧
Narración: Próxima escena: Escalinata principal.

# SCENE｜Escalinata principal
⟦BG|bg_c_c08s03|Escalinata principal；Personajes presentes：Tú, Lucian；Acción：Lucian ofrece las llaves de la puerta y los horarios de transporte. Llega un paquete para Nora con una grabadora.⟧
⟦TIME|09:50⟧
Narración: Poco después. Escalinata principal.
Narración: Lucian ofrece las llaves de la puerta y los horarios de transporte.
Narración: Llega un paquete para Nora con una grabadora.
Lucian: “No tienes que prometer que volverás.”
⟦FREE⟧
⟦SET|c_c08_event⟧

# CHOICE｜Si la regla es falsa, ¿quién quiere que sigas aquí?
#### A｜Impugnar la condición añadida mediante el abogado
Narración: La corrección avanza de forma independiente.
⟦OPT|A|set:c_c08_a⟧
#### B｜Salir de la abadía e investigar desde fuera
Narración: El alojamiento deja de ser un medio de control.
⟦OPT|B|set:c_c08_b⟧
#### C｜Quedarte voluntariamente para revisar el archivo
Narración: Conservas la posibilidad de marcharte en cualquier momento.
⟦OPT|C|set:c_c08_c⟧
# ·
Narración: Si la regla es falsa, ¿quién quiere que sigas aquí?

# CHAPTER 9｜Tu madre está viva
⟦GOAL|Comprender lo ocurrido en «Tu madre está viva» y decidir el siguiente paso.|Tu madre está viva⟧
⟦DONE|flag|c_c09_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Tu madre está viva», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Estudio de restauración de audio
⟦BG|bg_c_c09s01|Estudio de restauración de audio；Personajes presentes：Tú, Nora；Acción：Una grabación reciente contiene la voz de Mara y un parte meteorológico actual. Lucian se levanta y su silla cae.⟧
⟦TIME|10:00⟧
Narración: Más tarde esa mañana. Estudio de restauración de audio.
⟦IF|c_c08_a⟧
Narración: La corrección avanza de forma independiente.
⟦/IF⟧
⟦IF|c_c08_b⟧
Narración: El alojamiento deja de ser un medio de control.
⟦/IF⟧
⟦IF|c_c08_c⟧
Narración: Conservas la posibilidad de marcharte en cualquier momento.
⟦/IF⟧
Narración: Una grabación reciente contiene la voz de Mara y un parte meteorológico actual.
Narración: Lucian se levanta y su silla cae.
Nora: “No es una grabación antigua. Está viva.”
⟦FREE⟧
Narración: Próxima escena: Mesa del claustro por la mañana.

# SCENE｜Mesa del claustro por la mañana
⟦BG|bg_c_c09s02|Mesa del claustro por la mañana；Personajes presentes：Tú, Lucian；Acción：Un antiguo registro de llamadas muestra que Lucian había creído erróneamente que Mara había muerto. Retira la etiqueta antigua de la carpeta.⟧
⟦TIME|10:25⟧
Narración: Poco después. Mesa del claustro por la mañana.
Narración: Un antiguo registro de llamadas muestra que Lucian había creído erróneamente que Mara había muerto.
Narración: Retira la etiqueta antigua de la carpeta.
Lucian: “Pensé que había muerto. Me equivocaba.”
⟦FREE⟧
Narración: Próxima escena: Invernadero de la abadía.

# SCENE｜Invernadero de la abadía
⟦BG|bg_c_c09s03|Invernadero de la abadía；Personajes presentes：Tú, Nora；Acción：El buzón mencionado en la grabación contiene papel nuevo, un recibo de estación y un botón rojo conocido. Se oyen tres golpes en el cristal.⟧
⟦TIME|10:50⟧
Narración: Poco después. Invernadero de la abadía.
Narración: El buzón mencionado en la grabación contiene papel nuevo, un recibo de estación y un botón rojo conocido.
Narración: Se oyen tres golpes en el cristal.
Nora: “Busquemos una forma segura de confirmar el origen.”
⟦FREE⟧
⟦SET|c_c09_event⟧

# CHOICE｜¿Por qué teme tu madre verte si está viva?
#### A｜Verificar el lugar de la grabación
Narración: Nora comprueba el audio y busca una vía legal de contacto.
⟦OPT|A|set:c_c09_a⟧
#### B｜Averiguar si Mara desea contacto directo
Narración: Se deja un mensaje confidencial sin revelar dónde está.
⟦OPT|B|set:c_c09_b⟧
#### C｜Pedir los registros de rutas antiguas de Lucian
Narración: Entrega los documentos pertinentes sin dirigir tus movimientos.
⟦OPT|C|set:c_c09_c⟧
# ·
Narración: ¿Por qué teme tu madre verte si está viva?

# CHAPTER 10｜El beso que casi ocurrió
⟦GOAL|Comprender lo ocurrido en «El beso que casi ocurrió» y decidir el siguiente paso.|El beso que casi ocurrió⟧
⟦DONE|flag|c_c10_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «El beso que casi ocurrió», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Pasillo del invernadero
⟦BG|bg_c_c10s01|Pasillo del invernadero；Personajes presentes：Tú, Lucian；Acción：La lluvia golpea el cristal. Lucian deja una lámpara a tu alcance y mantiene libre la salida. Se detiene a un paso.⟧
⟦TIME|19:00⟧
Narración: La quinta noche. Pasillo del invernadero.
⟦IF|c_c09_a⟧
Narración: Nora comprueba el audio y busca una vía legal de contacto.
⟦/IF⟧
⟦IF|c_c09_b⟧
Narración: Se deja un mensaje confidencial sin revelar dónde está.
⟦/IF⟧
⟦IF|c_c09_c⟧
Narración: Entrega los documentos pertinentes sin dirigir tus movimientos.
⟦/IF⟧
Narración: La lluvia golpea el cristal.
Narración: Lucian deja una lámpara a tu alcance y mantiene libre la salida.
Narración: Se detiene a un paso.
Lucian: “Quiero besarte. No voy a dar por hecho que tú también quieras.”
⟦FREE⟧
Narración: Próxima escena: Mesa de trabajo del invernadero.

# SCENE｜Mesa de trabajo del invernadero
⟦BG|bg_c_c10s02|Mesa de trabajo del invernadero；Personajes presentes：Tú, Lucian；Acción：Una carta nueva indica la ruta al antiguo centro asistencial. Un documento de tutela muestra que Agnes seguía interfiriendo en la vida de Mara.⟧
⟦TIME|19:25⟧
Narración: Poco después. Mesa de trabajo del invernadero.
Narración: Una carta nueva indica la ruta al antiguo centro asistencial.
Narración: Un documento de tutela muestra que Agnes seguía interfiriendo en la vida de Mara.
Lucian: “Ahora importa más conseguir ese documento que aclarar lo nuestro.”
⟦FREE⟧
Narración: Próxima escena: Alero del invernadero.

# SCENE｜Alero del invernadero
⟦BG|bg_c_c10s03|Alero del invernadero；Personajes presentes：Tú, Lucian；Acción：Deja un paraguas cerca y espera bajo la lluvia. El abogado envía la autorización para recuperar legalmente los documentos de la sala.⟧
⟦TIME|19:50⟧
Narración: Poco después. Alero del invernadero.
Narración: Deja un paraguas cerca y espera bajo la lluvia.
Narración: El abogado envía la autorización para recuperar legalmente los documentos de la sala.
Lucian: “Puedo esperar. Dime qué te importa ahora.”
⟦FREE⟧
⟦SET|c_c10_event⟧

# CHOICE｜¿Dónde se oculta Mara mientras se sigue utilizando la antigua tutela?
#### A｜Expresar el deseo de cercanía sin perdonarlo
Narración: Solo se registra el deseo expresado, sin presuponer contacto físico.
⟦OPT|A|set:c_c10_a⟧
#### B｜Pedirle que no se acerque íntimamente
Narración: Mantiene la distancia solicitada.
⟦OPT|B|set:c_c10_b⟧
#### C｜Priorizar la seguridad de Mara
Narración: La investigación sigue sin compromiso íntimo.
⟦OPT|C|set:c_c10_c⟧
# ·
Narración: ¿Dónde se oculta Mara mientras se sigue utilizando la antigua tutela?

# CHAPTER 11｜La habitación cerrada
⟦GOAL|Comprender lo ocurrido en «La habitación cerrada» y decidir el siguiente paso.|La habitación cerrada⟧
⟦DONE|flag|c_c11_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La habitación cerrada», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Sala del antiguo centro asistencial
⟦BG|bg_c_c11s01|Sala del antiguo centro asistencial；Personajes presentes：Tú, Lucian；Acción：La cerradura oxidada se abre desde fuera. La pared está cubierta de marcas de calendario. Lucian se aferra al marco.⟧
⟦TIME|11:00⟧
Narración: La mañana del sexto día. Sala del antiguo centro asistencial.
⟦IF|c_c10_a⟧
Narración: Solo se registra el deseo expresado, sin presuponer contacto físico.
⟦/IF⟧
⟦IF|c_c10_b⟧
Narración: Mantiene la distancia solicitada.
⟦/IF⟧
⟦IF|c_c10_c⟧
Narración: La investigación sigue sin compromiso íntimo.
⟦/IF⟧
Narración: La cerradura oxidada se abre desde fuera.
Narración: La pared está cubierta de marcas de calendario.
Narración: Lucian se aferra al marco.
Lucian: “La traje aquí. Creí a Agnes cuando lo llamó tratamiento.”
⟦FREE⟧
Narración: Próxima escena: Archivador de la sala.

# SCENE｜Archivador de la sala
⟦BG|bg_c_c11s02|Archivador de la sala；Personajes presentes：Tú, Lucian；Acción：Pasa las páginas del registro. Han alterado un certificado de alta. Llora, pero no te pide que lo perdones.⟧
⟦TIME|11:25⟧
Narración: Poco después. Archivador de la sala.
Narración: Pasa las páginas del registro.
Narración: Han alterado un certificado de alta.
Narración: Llora, pero no te pide que lo perdones.
Lucian: “Mira la fecha. La cambiaron.”
⟦FREE⟧
Narración: Próxima escena: Salida del centro.

# SCENE｜Salida del centro
⟦BG|bg_c_c11s03|Salida del centro；Personajes presentes：Tú, Nora；Acción：Nora sella las órdenes médicas, las fotografías y los turnos como pruebas. El abogado de Agnes ya no bloquea la salida.⟧
⟦TIME|11:50⟧
Narración: Poco después. Salida del centro.
Narración: Nora sella las órdenes médicas, las fotografías y los turnos como pruebas.
Narración: El abogado de Agnes ya no bloquea la salida.
Nora: “Podemos poner los originales a salvo por la vía legal.”
⟦FREE⟧
⟦SET|c_c11_event⟧

# CHOICE｜¿Quién tiene derecho a pedir perdón por esto?
#### A｜Fotografiar la cerradura y conservar las huellas de la sala
Narración: Se documentan las pruebas físicas.
⟦OPT|A|set:c_c11_a⟧
#### B｜Exigir a Lucian un relato completo por escrito
Narración: Sus actos se incorporan al registro formal.
⟦OPT|B|set:c_c11_b⟧
#### C｜Pedir a los investigadores que obtengan los originales
Narración: Las pruebas se aseguran por procedimientos formales.
⟦OPT|C|set:c_c11_c⟧
# ·
Narración: ¿Quién tiene derecho a pedir perdón por esto?

# CHAPTER 12｜El certificado falso que firmó
⟦GOAL|Comprender lo ocurrido en «El certificado falso que firmó» y decidir el siguiente paso.|El certificado falso que firmó⟧
⟦DONE|flag|c_c12_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «El certificado falso que firmó», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Archivo notarial
⟦BG|bg_c_c12s01|Archivo notarial；Personajes presentes：Tú, Nora；Acción：Aparece el certificado de alta original. La firma de Lucian está fechada tres días antes de la fecha real de salida.⟧
⟦TIME|15:00⟧
Narración: Esa tarde. Archivo notarial.
⟦IF|c_c11_a⟧
Narración: Se documentan las pruebas físicas.
⟦/IF⟧
⟦IF|c_c11_b⟧
Narración: Sus actos se incorporan al registro formal.
⟦/IF⟧
⟦IF|c_c11_c⟧
Narración: Las pruebas se aseguran por procedimientos formales.
⟦/IF⟧
Narración: Aparece el certificado de alta original.
Narración: La firma de Lucian está fechada tres días antes de la fecha real de salida.
Nora: “La firma es auténtica. La fecha es falsa.”
⟦FREE⟧
Narración: Próxima escena: Sala de espera de la estación suburbana.

# SCENE｜Sala de espera de la estación suburbana
⟦BG|bg_c_c12s02|Sala de espera de la estación suburbana；Personajes presentes：Tú, Lucian；Acción：Lucian admite que sabía que Mara no había salido. Firmó para proteger la reputación de la abadía. Escribe una declaración completa.⟧
⟦TIME|15:25⟧
Narración: Poco después. Sala de espera de la estación suburbana.
Narración: Lucian admite que sabía que Mara no había salido.
Narración: Firmó para proteger la reputación de la abadía.
Narración: Escribe una declaración completa.
Lucian: “Sabía lo suficiente para negarme. Firmé de todos modos.”
⟦FREE⟧
Narración: Próxima escena: Sala de reuniones del abogado.

# SCENE｜Sala de reuniones del abogado
⟦BG|bg_c_c12s03|Sala de reuniones del abogado；Personajes presentes：Tú, Nora；Acción：Presenta una declaración que lo compromete a él mismo. El abogado recibe la noticia de que Mara quiere reunirse en un lugar confidencial.⟧
⟦TIME|15:50⟧
Narración: Poco después. Sala de reuniones del abogado.
Narración: Presenta una declaración que lo compromete a él mismo.
Narración: El abogado recibe la noticia de que Mara quiere reunirse en un lugar confidencial.
Nora: “Tenemos que respetar las condiciones de Mara.”
⟦FREE⟧
⟦SET|c_c12_event⟧

# CHOICE｜¿Qué le costó a tu madre aquella declaración falsa?
#### A｜Exigir una admisión formal y testimonio
Narración: La declaración entra en el procedimiento de rendición de cuentas.
⟦OPT|A|set:c_c12_a⟧
#### B｜Suspender el contacto privado y utilizar a Nora como intermediaria
Narración: La investigación continúa sin intimidad.
⟦OPT|B|set:c_c12_b⟧
#### C｜Dejar abierta la posibilidad de contacto futuro sin perdonar la falsedad
Narración: La confianza y la responsabilidad siguen separadas.
⟦OPT|C|set:c_c12_c⟧
# ·
Narración: ¿Qué le costó a tu madre aquella declaración falsa?

# CHAPTER 13｜Mamá vuelve bajo la lluvia
⟦GOAL|Comprender lo ocurrido en «Mamá vuelve bajo la lluvia» y decidir el siguiente paso.|Mamá vuelve bajo la lluvia⟧
⟦DONE|flag|c_c13_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Mamá vuelve bajo la lluvia», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Estación rural
⟦BG|bg_c_c13s01|Estación rural；Personajes presentes：Tú, Nora；Acción：Una mujer delgada aparece entre la lluvia junto a Nora. Sus ojos son los de la fotografía. Sostiene la vieja bufanda roja.⟧
⟦TIME|09:00⟧
Narración: La mañana del séptimo día. Estación rural.
⟦IF|c_c12_a⟧
Narración: La declaración entra en el procedimiento de rendición de cuentas.
⟦/IF⟧
⟦IF|c_c12_b⟧
Narración: La investigación continúa sin intimidad.
⟦/IF⟧
⟦IF|c_c12_c⟧
Narración: La confianza y la responsabilidad siguen separadas.
⟦/IF⟧
Narración: Una mujer delgada aparece entre la lluvia junto a Nora.
Narración: Sus ojos son los de la fotografía.
Narración: Sostiene la vieja bufanda roja.
Nora: “Mara me pidió que la acompañara hasta aquí.”
⟦FREE⟧
Narración: Próxima escena: Posada de un pueblo tranquilo.

# SCENE｜Posada de un pueblo tranquilo
⟦BG|bg_c_c13s02|Posada de un pueblo tranquilo；Personajes presentes：Tú, Mara；Acción：Mara extiende siete años de recibos con dedos temblorosos. Describe la falsa tutela y las amenazas. Hay una tarjeta de cumpleaños que nunca envió.⟧
⟦TIME|09:25⟧
Narración: Poco después. Posada de un pueblo tranquilo.
Narración: Mara extiende siete años de recibos con dedos temblorosos.
Narración: Describe la falsa tutela y las amenazas.
Narración: Hay una tarjeta de cumpleaños que nunca envió.
Mara: “No dejé de pensar en ti. No sabía cómo llegar a ti sin ponerte en peligro.”
⟦FREE⟧
Narración: Próxima escena: Sala privada de reunión familiar.

# SCENE｜Sala privada de reunión familiar
⟦BG|bg_c_c13s03|Sala privada de reunión familiar；Personajes presentes：Tú, Mara；Acción：Entrega a Nora registros de pagos que vinculan a Agnes con la falsificación de historiales médicos. Lucian no está presente.⟧
⟦TIME|09:50⟧
Narración: Poco después. Sala privada de reunión familiar.
Narración: Entrega a Nora registros de pagos que vinculan a Agnes con la falsificación de historiales médicos.
Narración: Lucian no está presente.
Mara: “Te contaré lo que pueda cuando estés preparada para escucharlo.”
⟦FREE⟧
⟦SET|c_c13_event⟧

# CHOICE｜¿Querréis afrontar juntas la exposición pública?
#### A｜Priorizar la seguridad y la salud de Mara
Narración: Se organizan apoyo y alojamiento independientes.
⟦OPT|A|set:c_c13_a⟧
#### B｜Escuchar lo que Mara desee compartir
Narración: Ella controla el ritmo de su relato.
⟦OPT|B|set:c_c13_b⟧
#### C｜Mantener cierta distancia hasta estar preparada
Narración: No se presupone un abrazo ni una reconciliación.
⟦OPT|C|set:c_c13_c⟧
# ·
Narración: ¿Querréis afrontar juntas la exposición pública?

# CHAPTER 14｜Una confesión de verdad
⟦GOAL|Comprender lo ocurrido en «Una confesión de verdad» y decidir el siguiente paso.|Una confesión de verdad⟧
⟦DONE|flag|c_c14_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Una confesión de verdad», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Sala de audiencia independiente
⟦BG|bg_c_c14s01|Sala de audiencia independiente；Personajes presentes：Tú, Lucian；Acción：Lucian admite haber firmado el certificado falso. Cada palabra se incorpora al acta.⟧
⟦TIME|14:00⟧
Narración: Esa tarde. Sala de audiencia independiente.
⟦IF|c_c13_a⟧
Narración: Se organizan apoyo y alojamiento independientes.
⟦/IF⟧
⟦IF|c_c13_b⟧
Narración: Ella controla el ritmo de su relato.
⟦/IF⟧
⟦IF|c_c13_c⟧
Narración: No se presupone un abrazo ni una reconciliación.
⟦/IF⟧
Narración: Lucian admite haber firmado el certificado falso.
Narración: Cada palabra se incorpora al acta.
Lucian: “Yo lo firmé. No me esconderé detrás de mis votos.”
⟦FREE⟧
Narración: Próxima escena: Escalinata de la abadía.

# SCENE｜Escalinata de la abadía
⟦BG|bg_c_c14s02|Escalinata de la abadía；Personajes presentes：Tú, Nora；Acción：Se restringe temporalmente la autoridad de Agnes. Se revisan los registros financieros y médicos. Se elimina la regla de las siete noches.⟧
⟦TIME|14:25⟧
Narración: Poco después. Escalinata de la abadía.
Narración: Se restringe temporalmente la autoridad de Agnes.
Narración: Se revisan los registros financieros y médicos.
Narración: Se elimina la regla de las siete noches.
Nora: “La investigación no ha terminado, pero nadie tiene que obedecer esa regla.”
⟦FREE⟧
Narración: Próxima escena: Último banco de la capilla.

# SCENE｜Último banco de la capilla
⟦BG|bg_c_c14s03|Último banco de la capilla；Personajes presentes：Tú, Lucian；Acción：Lucian se sienta en la última fila. La última vela se consume. Se disculpa sin pedirte que te quedes.⟧
⟦TIME|14:50⟧
Narración: Poco después. Último banco de la capilla.
Narración: Lucian se sienta en la última fila.
Narración: La última vela se consume.
Narración: Se disculpa sin pedirte que te quedes.
Lucian: “Perdón por todas las veces que elegí callar.”
⟦FREE⟧
⟦SET|c_c14_event⟧

# CHOICE｜¿Podrá quien al fin admite su culpa ganarse un encuentro entre iguales?
#### A｜Exigir más testimonio y revelaciones
Narración: Su responsabilidad sigue examinándose formalmente.
⟦OPT|A|set:c_c14_a⟧
#### B｜Limitar el contacto futuro a lo necesario
Narración: Los límites personales permanecen claros.
⟦OPT|B|set:c_c14_b⟧
#### C｜Expresar una posible atracción y exigir cambios duraderos
Narración: Acepta que debe demostrar el cambio sin reclamar una relación.
⟦OPT|C|set:c_c14_c⟧
# ·
Narración: ¿Podrá quien al fin admite su culpa ganarse un encuentro entre iguales?

# CHAPTER 15｜Libertad en la séptima noche
⟦GOAL|Comprender lo ocurrido en «Libertad en la séptima noche» y decidir el siguiente paso.|Libertad en la séptima noche⟧
⟦DONE|flag|c_c15_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «Libertad en la séptima noche», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Despacho del abogado de tu abuela
⟦BG|bg_c_c15s01|Despacho del abogado de tu abuela；Personajes presentes：Tú, Nora；Acción：El abogado confirma que la condición añadida es inválida y que puedes gestionar la herencia independientemente. Fuera suena la séptima campana.⟧
⟦TIME|21:00⟧
Narración: La séptima noche. Despacho del abogado de tu abuela.
⟦IF|c_c14_a⟧
Narración: Su responsabilidad sigue examinándose formalmente.
⟦/IF⟧
⟦IF|c_c14_b⟧
Narración: Los límites personales permanecen claros.
⟦/IF⟧
⟦IF|c_c14_c⟧
Narración: Acepta que debe demostrar el cambio sin reclamar una relación.
⟦/IF⟧
Narración: El abogado confirma que la condición añadida es inválida y que puedes gestionar la herencia independientemente.
Narración: Fuera suena la séptima campana.
Nora: “No tienes obligación de pasar otra noche en la abadía.”
⟦FREE⟧
Narración: Próxima escena: Exterior del muro de la abadía.

# SCENE｜Exterior del muro de la abadía
⟦BG|bg_c_c15s02|Exterior del muro de la abadía；Personajes presentes：Tú, Lucian；Acción：Lucian entrega las llaves al nuevo administrador. Ya no tiene acceso a la sala. Solo lleva la lista de pruebas.⟧
⟦TIME|21:25⟧
Narración: Poco después. Exterior del muro de la abadía.
Narración: Lucian entrega las llaves al nuevo administrador.
Narración: Ya no tiene acceso a la sala.
Narración: Solo lleva la lista de pruebas.
Lucian: “No tienes que decirme adónde vas.”
⟦FREE⟧
Narración: Próxima escena: Claustro en la séptima noche.

# SCENE｜Claustro en la séptima noche
⟦BG|bg_c_c15s03|Claustro en la séptima noche；Personajes presentes：Tú, Mara；Acción：Mara espera bajo la lámpara mientras Nora entrega recibos. Nadie bloquea el paso. Se acerca el amanecer.⟧
⟦TIME|21:50⟧
Narración: Poco después. Claustro en la séptima noche.
Narración: Mara espera bajo la lámpara mientras Nora entrega recibos.
Narración: Nadie bloquea el paso.
Narración: Se acerca el amanecer.
Mara: “¿Qué quieres llevarte al marcharte?”
⟦FREE⟧
⟦SET|c_c15_event⟧

# CHOICE｜¿Cómo es la libertad más allá de la abadía?
#### A｜Apoyar el acceso legal a los archivos
Narración: Se inicia la transición con medidas de privacidad adecuadas.
⟦OPT|A|set:c_c15_a⟧
#### B｜Priorizar la herencia y la recuperación familiar
Narración: Mara tiene voz en las decisiones y el romance puede esperar.
⟦OPT|B|set:c_c15_b⟧
#### C｜Marcharte y reconsiderar cualquier relación privada más adelante
Narración: No se presupone un reencuentro y sigues siendo libre de irte.
⟦OPT|C|set:c_c15_c⟧
# ·
Narración: ¿Cómo es la libertad más allá de la abadía?

# CHAPTER 16｜La elección a la luz de la mañana
⟦GOAL|Comprender lo ocurrido en «La elección a la luz de la mañana» y decidir el siguiente paso.|La elección a la luz de la mañana⟧
⟦DONE|flag|c_c16_event|Presenciar el hecho clave|Narración: Puedes detenerte a examinar lo que acaba de ocurrir.⟧
⟦DONE|say|Decir qué quieres hacer ante lo ocurrido en «La elección a la luz de la mañana», o si prefieres negarte o esperar|Expresar tu intención|Narración: Puedes decir qué necesitas o pedir más tiempo.⟧

# SCENE｜Archivo público
⟦BG|bg_c_c16s01|Archivo público；Personajes presentes：Tú, Nora；Acción：Seis meses después, la vieja biblioteca abre como archivo. El nombre de Lucian aparece en una declaración pública conforme a la ley.⟧
⟦TIME|10:00⟧
Narración: Seis meses después. Archivo público.
⟦IF|c_c15_a⟧
Narración: Se inicia la transición con medidas de privacidad adecuadas.
⟦/IF⟧
⟦IF|c_c15_b⟧
Narración: Mara tiene voz en las decisiones y el romance puede esperar.
⟦/IF⟧
⟦IF|c_c15_c⟧
Narración: No se presupone un reencuentro y sigues siendo libre de irte.
⟦/IF⟧
Narración: Seis meses después, la vieja biblioteca abre como archivo.
Narración: El nombre de Lucian aparece en una declaración pública conforme a la ley.
Nora: “El caso sigue en curso. Por fin se pueden consultar los documentos.”
⟦FREE⟧
Narración: Próxima escena: Mesa occidental del archivo.

# SCENE｜Mesa occidental del archivo
⟦BG|bg_c_c16s02|Mesa occidental del archivo；Personajes presentes：Tú, Lucian；Acción：Lucian acude con cita y un cuaderno donde deja constancia de los pasos que ha dado para asumir su responsabilidad. Espera a que lo invites a sentarse.⟧
⟦TIME|10:25⟧
Narración: Poco después. Mesa occidental del archivo.
Narración: Lucian acude con cita y un cuaderno donde deja constancia de los pasos que ha dado para asumir su responsabilidad.
Narración: Espera a que lo invites a sentarse.
Lucian: “Si podemos volver a vernos, me gustaría pasar una tarde contigo sin ocultarte nada.”
⟦FREE⟧
Narración: Próxima escena: Sendero del valle por la mañana.

# SCENE｜Sendero del valle por la mañana
⟦BG|bg_c_c16s03|Sendero del valle por la mañana；Personajes presentes：Tú, Lucian；Acción：La niebla se retira del antiguo edificio. La luz de la mañana ilumina el rosario de Mara. El camino está abierto en ambas direcciones.⟧
⟦TIME|10:50⟧
Narración: Poco después. Sendero del valle por la mañana.
Narración: La niebla se retira del antiguo edificio.
Narración: La luz de la mañana ilumina el rosario de Mara.
Narración: El camino está abierto en ambas direcciones.
Lucian: “Me gustaría acompañarte. Pero si prefieres ir sola, no voy a detenerte.”
⟦FREE⟧
⟦SET|c_c16_event⟧

# CHOICE｜La puerta de la mañana permanece abierta. La confesión ya no es una cadena.
#### A｜Elegir expresamente un romance igualitario cuando la responsabilidad y los límites lo permitan
Narración: Solo una voluntad expresada abre la ruta romántica. El proceso legal sigue siendo independiente.
⟦OPT|A|set:c_c16_a⟧
#### B｜Elegir la amistad y el trabajo compartido en el archivo
Narración: La relación continúa sin obligaciones románticas.
⟦OPT|B|set:c_c16_b⟧
#### C｜Elegir la independencia o aplazar el contacto privado
Narración: Tu vida sigue sin hacer del amor una condición de redención.
⟦OPT|C|set:c_c16_c⟧
# ·
Narración: La puerta de la mañana permanece abierta. La confesión ya no es una cadena.

