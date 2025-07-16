import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

export type Option = {
    text: string
    icon: IconDefinition
}

export type CustomSelectProps = {
    title: string;
    options: Option[]
};


