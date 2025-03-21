# Creador de tests

## Resumen

Esto es un programa que crea exámenes tipo tests eligiendo las preguntas y poniendo el orden de las respuestas de manera aleatoria. Una vez generado el html se puede responder al examen y se autocorrige y da la nota que se ha sacado.

## Uso

Para generar exámenes hay que ejecutar el fichero llamado [main.py](/main.py). Ahora mismo el número de exámenes, el número de preguntas y la asignatura está codificado como variables en el código. Si las cambias no subas esos cambios al github.

## Contribuir

**Importante:** Al hacer un pull request se realiza una comprobación de formateo que para pasarla deben estar los ficheros con un formato en específico. La mejor manera de asegurarse de que esto siempre ocurra es ejecutar la acción sobre formateo en el fork que has creado. Es necesario que sea en el fork; y solo se necesita una vez manualmente, ya que se ejecuta cada vez que haya un cambio en el fork. No se ejecuta de manera automática inicialmente por razones de seguridad en GitHub.

La manera fácil de contribuir es añadiendo más preguntas. Estas se encuentran en los ficheros .json que hay en la carpeta de cada asignatura. Los ficheros tienen que seguir el formato de empezar por `Unit` y acabar por `.json`. Cada fichero es un diccionario con una única clave `questions` cuyo valor es una lista de diccionarios. Más bajo se explica cada tipo de pregunta que está implementado. Antes de subir una pregunta nueva asegúrate de que está bien escrita, la respuesta es la correcta y que el programa sigue funcionando.

Para añadir tus cambios haz un fork con el nombre de la asignatura a la que quieres añadir preguntas y añade las preguntas. Luego haz un pull request y si todo está bien se añadirá al programa.

### `singleChoice`

Tiene que tener las siguientes claves:

- `question`: La pregunta que se quiere hacer.
- `options`: Una lista de strings con las opciones de respuesta.
- `correct_option`: Un entero que indica el índice de la lista de opciones que es la correcta. Este índice está en base 0.
- `questionType`: Un string que indica el tipo de pregunta. Tiene que ser `singleChoice` para este tipo de pregunta.

### `multipleChoice`

Tiene que tener las siguientes claves:

- `question`: La pregunta que se quiere hacer.
- `options`: Una lista de strings con las opciones de respuesta.
- `correct_options`: Una lista de enteros que indica los índices de la lista de opciones que son correctas. Estos índices están en base 0.
- `questionType`: Un string que indica el tipo de pregunta. Tiene que ser `multipleChoice` para este tipo de pregunta.

### Contribuir avanzado

Si quieres cambiar el código para mejorarlo o refactorizarlo, abre un issue y hablamos si los cambios que propones son útiles para este proyecto.
