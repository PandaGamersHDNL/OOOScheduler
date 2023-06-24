import { Icon, Persona, PersonaPresence, PersonaSize } from "@fluentui/react";
import { useEffect, useState } from "react";
import { IProfile } from "../../../Models/GraphUser";
import { GraphService } from "../../../services/GraphService";
import { getSSOToken } from "../../../services/AuthService";

export default function Profile() {
    const [profile, setProfile] = useState<IProfile>(/*{
        imageInitials: "EU",
        text: "Example User",
        secondaryText: "Test title",
        showSecondaryText: true
    }*/);
    const getInitials = (meUser: IProfile | undefined) => {

        var initials = "";
        if (meUser) {
            if (meUser.givenName) {

                initials += meUser.givenName.at(0)
            }
            if (meUser.surname) {
                initials += meUser.surname.at(0)
            }
        }
        if (initials.length > 0) {
            return initials
        } else {

            return undefined
        }
    }
    useEffect(() => {
        new GraphService(() => getSSOToken(false)).getUserProfile().then((v) => setProfile(v))
    }, []);


    return (
        <>
        <Persona
            imageUrl={profile?.imgUrl}
            text={profile?.displayName}
            imageInitials={getInitials(profile)}
            size={PersonaSize.size48}
            presence={PersonaPresence.none}
            className={"NavText"}
            
            />
        </>
    )

}
