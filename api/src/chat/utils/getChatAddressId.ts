
type ChatAddressIdentifiers = {
    channelId: string;
    user: { id: string };
}

export default function getChatAddressId(chatAddress: ChatAddressIdentifiers): string {
    return `${chatAddress.channelId}-${chatAddress.user.id}`;
}