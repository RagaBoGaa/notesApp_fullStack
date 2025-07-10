import { useState } from 'react';
import toast from 'react-hot-toast';

interface DeletableEntity {
  _id: string;
  [key: string]: any;
}

interface UseDeleteModalConfig<T extends DeletableEntity> {
  deleteMutation: any;
  entityName?: string;
  onSuccess?: (deletedEntity: T) => void;
  onError?: (error: any, entity: T) => void;
}

export const useDeleteModal = <T extends DeletableEntity>({
  deleteMutation,
  entityName = 'Item',
  onSuccess,
  onError,
}: UseDeleteModalConfig<T>) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<T | null>(null);

  const [deleteEntity, { isLoading: isDeleting }] = deleteMutation();

  const handleDeleteClick = (entity: T) => {
    setEntityToDelete(entity);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setEntityToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!entityToDelete) return;

    try {
      await deleteEntity({ id: entityToDelete._id }).unwrap();
      toast.success(`${entityName} deleted successfully!`);
      setShowDeleteModal(false);
      setEntityToDelete(null);
      if (onSuccess) {
        onSuccess(entityToDelete);
      }

      handleCancelDelete();
    } catch (error) {
      console.error(`Failed to delete ${entityName.toLowerCase()}:`, error);
      toast.error(`Failed to delete ${entityName.toLowerCase()}.`);

      if (onError) {
        onError(error, entityToDelete);
      }
    }
  };

  return {
    showDeleteModal,
    entityToDelete,
    isDeleting,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
};
