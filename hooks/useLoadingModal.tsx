// hooks/useLoadingModal.tsx
import { useState } from "react";
import { Modal, ActivityIndicator, View, StyleSheet } from "react-native";

interface UseLoadingModalReturn {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  LoadingModal: React.FC;
}

export const useLoadingModal = (): UseLoadingModalReturn => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  const LoadingModal: React.FC = () => (
    <Modal
      transparent
      animationType="fade"
      visible={isLoading}
      onRequestClose={hideLoading}
    >
      <View className="justify-center items-center flex-1 bg-black/50">
        <View className="justify-center items-center p-5 bg-white rounded-[20px]">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </View>
    </Modal>
  );

  return {
    isLoading,
    showLoading,
    hideLoading,
    LoadingModal,
  };
};
