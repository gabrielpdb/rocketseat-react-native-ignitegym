import { HistoryCard } from "@components/HistoryCard"
import { Loading } from "@components/Loading"
import { ScreenHeader } from "@components/ScreenHeader"
import { HistoryGroupByDayDTO } from "@dtos/HistoryGroupByDayDTO"
import {
  Heading,
  Text,
  Toast,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed"
import { useFocusEffect } from "@react-navigation/native"
import { api } from "@services/api"
import { AppError } from "@utils/AppError"
import { useCallback, useState } from "react"
import { SectionList } from "react-native"

export function History() {
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()
  const [exercises, setExercises] = useState<HistoryGroupByDayDTO[]>([])

  async function fetchHistory() {
    try {
      setIsLoading(true)
      const { data } = await api.get("/history")
      setExercises(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : "Não foi possível carregar o histórico"

      toast.show({
        placement: "top",
        render: () => (
          <Toast backgroundColor="$red500" action="error" variant="outline">
            <ToastTitle color="$white" textAlign="center">
              {title}
            </ToastTitle>
          </Toast>
        ),
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
    }, [])
  )

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de exercícios" />
      {isLoading ? (
        <Loading />
      ) : (
        <SectionList
          sections={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading color="$gray200" fontSize={"$md"} mt="$10" mb={"$3"}>
              {section.title}
            </Heading>
          )}
          style={{ paddingHorizontal: 32 }}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: "center" }
          }
          ListEmptyComponent={() => (
            <Text textAlign="center" color="$gray100">
              Não há exercícios registrados ainda.{"\n"} Vamos treinar?
            </Text>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </VStack>
  )
}
