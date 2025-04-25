import { ExerciseCard } from "@components/ExerciseCard"
import { Group } from "@components/Group"
import { HomeHeader } from "@components/HomeHeader"
import {
  Heading,
  HStack,
  Text,
  Toast,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed"
import { useNavigation } from "@react-navigation/native"
import { AppNavigatorRoutesProps } from "@routes/app.routes"
import { api } from "@services/api"
import { AppError } from "@utils/AppError"
import { useEffect, useState } from "react"
import { FlatList } from "react-native"

export function Home() {
  const [exercises, setExercises] = useState([
    "Puxada frontal",
    "Remada Curvada",
    "Remada Unilateral",
    "Levantamento Terra",
  ])
  const [groups, setGroups] = useState<string[]>([])
  const [groupSelected, setGroupSelected] = useState("Costas")

  const toast = useToast()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails() {
    navigation.navigate("exercise")
  }

  async function fetchGroups() {
    try {
      const { data } = await api.get("/groups")

      setGroups(data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : "Não foi possível carregar os grupos musculares"

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
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  return (
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 32 }}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }}
      />

      <VStack px="$8" flex={1}>
        <HStack justifyContent="space-between" mb="$5" alignItems="center">
          <Heading color="$gray200" fontSize={"$md"} fontFamily="$heading">
            Exercícios
          </Heading>
          <Text color="$gray200" fontSize={"$sm"} fontFamily="$body">
            {exercises.length}
          </Text>
        </HStack>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <ExerciseCard onPress={handleOpenExerciseDetails} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </VStack>
    </VStack>
  )
}
