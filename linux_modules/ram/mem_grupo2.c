#include <linux/module.h>
// para usar KERN_INFO
#include <linux/kernel.h>
// para info_ram
#include <linux/mm.h>
// Header para los macros module_init y module_exit
#include <linux/init.h>
// Header necesario porque se usara proc_fs
#include <linux/proc_fs.h>

/* Header para usar la lib seq_file y manejar el archivo en /proc*/
#include <linux/seq_file.h>

// Constantes de utilidad
const long MEGABYTE = 1024 * 1024;

// Variables para almacenar estadísticas del sistema
struct sysinfo sysinfo;
unsigned long totalRam;
unsigned long freeRam;
unsigned long occupiedRam;
unsigned long percentageOccupiedRam;

// Firma del modulo mem_grupo2
MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de RAM");
MODULE_AUTHOR("Grupo 2");

static void init_meminfo(void)
{
    si_meminfo(&sysinfo);
}

/**
 * Función que escribe en el archivo mem_grupo2 los datos obtenidos
 * de la memoria RAM, cada vez que se lea el archivo con el comando cat.
 */
static int write(struct seq_file *file, void *v)
{
    init_meminfo();
    totalRam = ((sysinfo.totalram * sysinfo.mem_unit) / MEGABYTE);
    freeRam = ((sysinfo.freeram * sysinfo.mem_unit) / MEGABYTE);
    occupiedRam = totalRam - freeRam;
    percentageOccupiedRam = ((occupiedRam * 100) / totalRam);
    seq_printf(file, "{ \"Total\": %li , \"Occupied\": %li , \"Percentage\": %li , \"Free\": %li }\n", totalRam, occupiedRam, percentageOccupiedRam, freeRam);
    return 0;
}

/**
 * Función que retornara los datos dentro del archivo mem_grupo2
 * cada vez que se lea el archivo con el comando cat.
 */
static int read(struct inode *inode, struct file *file)
{
    return single_open(file, write, NULL);
}

/**
 * Si el kernel es menor a 5.6 se usa la estructura file_operations
 */
static struct file_operations operations =
    {
        .open = read,
        .read = seq_read};

/**
 * Función que se ejecuta al momento de insertar el modulo de
 * memoria mem_grupo2 en el kernel con el comando insmod.
 */
static int _insert(void)
{
    proc_create("mem_grupo2", 0, NULL, &operations);
    printk(KERN_INFO "Hola mundo, somos el grupo 2 y este es el monitor de memoria.\n");
    return 0;
}

/**
 * Función que se ejecuta al momento de remover el modulo de
 * memoria mem_grupo2 del kernel con el comando rmmod.
 */
static void _remove(void)
{
    remove_proc_entry("mem_grupo2", NULL);
    printk(KERN_INFO "Sayonara mundo, somos el grupo 2 y este fue el monitor de memoria.\n");
}

module_init(_insert);
module_exit(_remove);