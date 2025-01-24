export type Data = {
  id: number;
  image: any;
  title: string;
  text: string;
};

const OnboardingData: Data[] = [
  {
    id: 1,
    image: require("@/assets/animation/online-business-conference.json"),
    title: "Strength in Collaboration",
    text: "Team up, achieve more. Let's grow together and make things happen!",
  },
  {
    id: 2,
    image: require("@/assets/animation/online-chatting.json"),
    title: "Conversations that matter",
    text: "Chat, connect, and share what really counts. Join the conversation that matters to you.",
  },
  {
    id: 3,
    image: require("@/assets/animation/online-transaction.json"),
    title: "Transactions with a mission",
    text: "Every exchange counts. Support what you believe in, with every transaction.",
  },
];

export default OnboardingData;
