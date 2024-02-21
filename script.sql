CREATE SCHEMA `examen` ;

CREATE TABLE `examen`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `correo_UNIQUE` (`correo` ASC) VISIBLE);

CREATE TABLE `examen`.`new_table` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `foto` VARCHAR(200) NOT NULL,
  `descripcion` VARCHAR(200) NOT NULL,
  `id_usuario` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `id_usuario_idx` (`id_usuario` ASC) VISIBLE,
  CONSTRAINT `id_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `examen`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
