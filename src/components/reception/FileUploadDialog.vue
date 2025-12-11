<template>
  <Dialog
    :visible="visible"
    modal
    header="Gestión de Archivos"
    :style="{ width: '800px' }"
    @update:visible="closeDialog"
  >
    <TabView>
      <!-- Tab 1: Cargar Archivo -->
      <TabPanel header="Cargar Archivo">
        <div class="p-fluid">
          <div class="field">
            <label>Archivo *</label>
            <FileUpload
              ref="fileUploadRef"
              name="file"
              :maxFileSize="52428800"
              :customUpload="true"
              @uploader="handleFileSelect"
              :auto="false"
              chooseLabel="Seleccionar Archivo"
              uploadLabel="Cargar"
              cancelLabel="Cancelar"
            />
            <small v-if="selectedFile" class="text-success">
              ✓ Archivo seleccionado: {{ selectedFile.name }} ({{
                formatFileSize(selectedFile.size)
              }})
            </small>
          </div>

          <div class="field">
            <label>Descripción (Opcional)</label>
            <Textarea
              v-model="formData.description"
              rows="3"
              placeholder="Descripción del archivo"
            />
          </div>

          <div class="flex gap-2 justify-content-end">
            <Button
              label="Guardar"
              severity="success"
              @click="submit"
              :loading="isUploading"
              :disabled="!selectedFile || isUploading"
            />
          </div>
        </div>
      </TabPanel>

      <!-- Tab 2: Archivos Cargados -->
      <TabPanel header="Archivos Cargados">
        <div class="files-list">
          <div
            v-if="loadingFiles"
            class="flex justify-content-center align-items-center"
            style="min-height: 300px"
          >
            <ProgressSpinner />
          </div>

          <div v-else-if="uploadedFiles.length === 0" class="text-center py-4">
            <p class="text-500">No hay archivos cargados</p>
          </div>

          <DataTable v-else :value="uploadedFiles" striped-rows class="p-datatable-sm">
            <Column field="name" header="Nombre">
              <template #body="slotProps">
                <a href="#" @click.prevent="downloadFile(slotProps.data)" class="text-primary">
                  {{ slotProps.data.name }}
                </a>
              </template>
            </Column>
            <Column field="size" header="Tamaño">
              <template #body="slotProps">
                {{ formatFileSize(slotProps.data.size) }}
              </template>
            </Column>
            <Column field="description" header="Descripción" />
            <Column field="createdAt" header="Fecha">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.createdAt) }}
              </template>
            </Column>
            <Column header="Acción" style="width: 80px">
              <template #body="slotProps">
                <Button
                  icon="pi pi-download"
                  class="p-button-text p-button-info p-button-sm"
                  @click="downloadFile(slotProps.data)"
                  :loading="downloadingFileId === slotProps.data.id"
                  v-tooltip="'Descargar'"
                />
                <Button
                  icon="pi pi-trash"
                  class="p-button-text p-button-danger p-button-sm"
                  @click="deleteFile(slotProps.data.id)"
                  v-tooltip="'Eliminar'"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </TabPanel>
    </TabView>

    <template #footer>
      <Button label="Cerrar" severity="secondary" @click="closeDialog" />
    </template>
  </Dialog>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import { useToast } from 'primevue/usetoast'
import filesService from '@/services/filesService.js'

export default {
  name: 'FileUploadDialog',
  components: {
    Dialog,
    Button,
    Textarea,
    FileUpload,
    TabView,
    TabPanel,
    DataTable,
    Column,
    ProgressSpinner,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    reception: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:visible', 'uploaded'],
  setup(props, { emit }) {
    const toast = useToast()
    const isUploading = ref(false)
    const loadingFiles = ref(false)
    const downloadingFileId = ref(null)
    const selectedFile = ref(null)
    const fileUploadRef = ref(null)
    const uploadedFiles = ref([])

    const formData = ref({
      description: '',
    })

    const handleFileSelect = (event) => {
      selectedFile.value = event.files[0]
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
    }

    const formatDate = (dateString) => {
      if (!dateString) return '—'
      return new Date(dateString).toLocaleDateString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const fetchUploadedFiles = async () => {
      if (!props.reception?.id) return

      loadingFiles.value = true
      try {
        const { data } = await filesService.getByReceptionId(props.reception.id)
        uploadedFiles.value = data.content || data || []
        console.log('✅ Archivos cargados:', uploadedFiles.value)
      } catch (error) {
        console.error('❌ Error cargando archivos:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los archivos',
          life: 3000,
        })
      } finally {
        loadingFiles.value = false
      }
    }

    const closeDialog = () => {
      emit('update:visible', false)
      resetForm()
    }

    const resetForm = () => {
      selectedFile.value = null
      formData.value.description = ''
      if (fileUploadRef.value) {
        fileUploadRef.value.clear()
      }
    }

    const submit = async () => {
      if (!selectedFile.value || !props.reception?.id) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Archivo y recepción requeridos',
          life: 3000,
        })
        return
      }

      isUploading.value = true
      try {
        const receptionId = props.reception.id
        const userId = parseInt(localStorage.getItem('user_id')) || 1
        const description = formData.value.description || ''

        console.log('📤 Subiendo archivo:', selectedFile.value.name)

        await filesService.create(receptionId, userId, selectedFile.value, description)

        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Archivo adjuntado correctamente',
          life: 3000,
        })

        resetForm()
        await fetchUploadedFiles()
        emit('uploaded')
      } catch (error) {
        console.error('❌ Error subiendo archivo:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo adjuntar el archivo',
          life: 3000,
        })
      } finally {
        isUploading.value = false
      }
    }

    const deleteFile = async (fileId) => {
      if (!confirm('¿Está seguro de que desea eliminar este archivo?')) return

      try {
        await filesService.delete(fileId)
        uploadedFiles.value = uploadedFiles.value.filter((f) => f.id !== fileId)
        toast.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Archivo eliminado correctamente',
          life: 3000,
        })
      } catch (error) {
        console.error('❌ Error eliminando archivo:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el archivo',
          life: 3000,
        })
      }
    }

    const downloadFile = (file) => {
      const token = localStorage.getItem('token')
      const headers = {
        Authorization: token ? `Bearer ${token}` : '',
      }

      downloadingFileId.value = file.id

      // Construir la URL de descarga
      const downloadUrl = `${import.meta.env.VITE_API_URL}/api/v1/files/download/${file.id}`

      // Crear un elemento <a> temporal para descargar
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = file.name || `archivo_${file.id}`

      // Agregar header de autorización si es necesario
      if (token) {
        // Para mantener el token, usamos fetch
        fetch(downloadUrl, { headers })
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(blob)
            link.href = url
            link.click()
            window.URL.revokeObjectURL(url)
            toast.add({
              severity: 'success',
              summary: 'Descarga completada',
              detail: `Archivo ${file.name} descargado`,
              life: 2000,
            })
          })
          .catch((error) => {
            console.error('❌ Error descargando archivo:', error)
            toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo descargar el archivo',
              life: 3000,
            })
          })
          .finally(() => {
            downloadingFileId.value = null
          })
      } else {
        link.click()
        downloadingFileId.value = null
      }
    }

    watch(
      () => props.visible,
      (newVal) => {
        if (newVal && props.reception?.id) {
          fetchUploadedFiles()
        }
      },
    )

    return {
      formData,
      isUploading,
      loadingFiles,
      selectedFile,
      fileUploadRef,
      uploadedFiles,
      closeDialog,
      submit,
      handleFileSelect,
      formatFileSize,
      formatDate,
      deleteFile,
      downloadFile,
      fetchUploadedFiles,
      loadingFiles,
      downloadingFileId,
    }
  },
}
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.field label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.text-success {
  color: #10b981;
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

.files-list {
  padding: 1rem 0;
}

.text-500 {
  color: #a3a6b4;
}

.text-primary {
  color: #3b82f6;
  text-decoration: none;
}

.text-primary:hover {
  text-decoration: underline;
}

.py-4 {
  padding: 1rem 0;
}
</style>
