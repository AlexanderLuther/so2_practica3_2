//Include obligatorio para trabajar modulos del kernel
#include <linux/module.h>

//Include para macro KERN_INFO
#include <linux/kernel.h>

//Include para macros __init y __exit 
#include <linux/init.h>

//Include para struct task_struct
#include <linux/sched/signal.h>

//Include para manejo de memoria
#include <linux/mm.h>

//Include para hacer uso de los macros proc_create y remove_proc_entry
#include <linux/proc_fs.h>

//Include para hacer uso de los macros seq_printf, single_open y seq_read
#include <linux/seq_file.h>

// Estructuras para almacenar informacion
struct task_struct *process;
struct task_struct *task_child;
struct list_head *list;

// Firma del modulo cpu_grupo2
MODULE_LICENSE("GPL");
MODULE_DESCRIPTION("Modulo de CPU");
MODULE_AUTHOR("Grupo 2");

/**
 * Funcion que escribe en el archivo cpu_grupo2 los datos obtenidos
 * de los procesos, cada vez que se lea el archivo con el comando cat.
 */
static int write(struct seq_file *file, void *v)
{
    long rss;
    bool esPadre, first, next = true, conhijos;

    seq_printf(file, "{\"root\": [\n");
    for_each_process(process)
    {
        first = true;
        if (process->mm)
        {
            rss = get_mm_rss(process->mm);

            if (next)
            {
                seq_printf(file, "{\"Process\":\"%s\",\n\"PID\":\"%d\",\n\"RAM\":\"%ld\",\n\"User\":\"%d\",\n\"State\":\"%ld\",\n", process->comm, process->pid, rss, __kuid_val(process->real_cred->uid), process->state);
                next = false;
            }
            else
            {
                seq_printf(file, ",{\"Process\":\"%s\",\n\"PID\":\"%d\",\n\"RAM\":\"%ld\",\n\"User\":\"%d\",\n\"State\":\"%ld\",\n", process->comm, process->pid, rss, __kuid_val(process->real_cred->uid), process->state);
            }
            esPadre = true;
        }
        else
        {
            if (next)
            {
                seq_printf(file, "{\"Process\":\"%s\",\n\"PID\":\"%d\",\n\"RAM\":\"0\",\n\"User\":\"%d\",\n\"State\":\"%ld\",\n", process->comm, process->pid, __kuid_val(process->real_cred->uid), process->state);
                next = false;
            }
            else
            {
                seq_printf(file, ",{\"Process\":\"%s\",\n\"PID\":\"%d\",\n\"RAM\":\"0\",\n\"User\":\"%d\",\n\"State\":\"%ld\",\n", process->comm, process->pid, __kuid_val(process->real_cred->uid), process->state);
            }
            esPadre = true;
        }

        conhijos = false;
        seq_printf(file, "\"Children\":[");
        list_for_each(list, &(process->children))
        {
            task_child = list_entry(list, struct task_struct, sibling);

            conhijos = true;
            if (first)
            {
                seq_printf(file, "\n{\"Process\":\"%s\",\n\"PID\":\"%d\",\n\"State\":\"%ld\"}", task_child->comm, task_child->pid, task_child->state);
                first = false;
            }
            else
            {
                seq_printf(file, ",\n{\"Process\":\"%s\",\n\"PID\":\"%d\",\n\"State\":\"%ld\"}", task_child->comm, task_child->pid, task_child->state);
            }
        }
        if (esPadre && conhijos)
        {
            seq_printf(file, "]\n}\n");
        }
        else if (esPadre)
        {
            seq_printf(file, "]\n}\n");
        }
        else
        {
            seq_printf(file, "},\n");
        }
    }
    seq_printf(file, "]}\n");
    return 0;
}

/**
 * Funcion que retornara los datos dentro del archivo cpu_grupo2
 * cada vez que se lea el archivo con el comando cat.
 */
static int read(struct inode *inode, struct file *file)
{
    return single_open(file, write, NULL);
}

/**
 * El kernel es menor a 5.6 por lo tanto se usa la estructura file_operations
 */
static struct file_operations operations =
    {
        .open = read,
        .read = seq_read};

/**
 * Funcion que se ejecuta al momento de insertar el modulo de
 * memoria mem_grupo2 en el kernel con el comando insmod.
 */
static int _insert(void)
{
    proc_create("cpu_grupo2", 0, NULL, &operations);
    printk(KERN_INFO "Hola mundo, somos el grupo 2 y este es el monitor de CPU.\n");
    return 0;
}

/**
 * Funcion que se ejecuta al momento de remover el modulo de
 * memoria mem_grupo2 del kernel con el comando rmmod.
 */
static void _remove(void)
{
    remove_proc_entry("cpu_grupo2", NULL);
    printk(KERN_INFO "Sayonara mundo, somos el grupo 2 y este fue el monitor de CPU.\n");
}

module_init(_insert);
module_exit(_remove);