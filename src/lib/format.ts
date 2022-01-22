function dateFromString(date: string) {
    let result = new Date(date);
    let userTimezoneOffset = result.getTimezoneOffset() * 60000;

    return new Date(result.getTime() + userTimezoneOffset);
}

export const formatLongDate = (date: Date | string): string => {
    if (date === null) {
        return 'jamais';
    }

    if (typeof date === 'string') {
        date = dateFromString(date);
    }

    let months: Array<string> = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    let longDate: string = '';

    longDate += date.getDate() + (date.getDate() === 1 ? 'er' : '') + ' ';
    longDate += months[date.getMonth()] + ' ';
    longDate += date.getFullYear();

    return longDate;
}

export const formatShortTime = (time: Date | string): string => {
    if (time === null) {
        return 'jamais';
    }

    if (typeof time === 'string') {
        time = dateFromString(time);
    }

    let longTime: string = '';

    longTime += time.getHours() + ':' + (time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes());

    return longTime;
}

export const formatAgo = (days: number | null): string => {
    if (days === null) {
        return 'jamais';
    }

    let ago: string = '';

    //Moins de 31 jours, on affiche semaines/jours
    if (days <= 31) {
        let weeks = Math.floor(days / 7);

        if (weeks > 0) {
            ago += weeks.toString() + ' semaine' + (weeks > 1 ? 's' : '');
            days -= (weeks * 7);
        }

        if (weeks > 0 && days > 0) {
            ago += ' et ';
        }

        if (days > 0) {
            ago += days.toString() + ' jour' + (days > 1 ? 's' : '');
        }

        return ago;
    }

    //Autrement onm affiche années/mois
    let today = new Date();
    let date = new Date();
    date.setDate(date.getDate() - days);

    let months = (today.getFullYear() - date.getFullYear()) * 12;
    months -= date.getMonth();
    months += today.getMonth();

    let years = Math.floor(months / 12);

    if (years > 0) {
        ago += years.toString() + ' an' + (years > 1 ? 's' : '');
        months -= (years * 12);
    }

    if (years > 0 && months > 0) {
        ago += ' et ';
    }

    ago += months.toString() + ' mois';

    return ago;
}

export const formatGender = (gender: string) => {
    let genderUpper = (gender ? gender.toUpperCase() : '');

    if (genderUpper === 'MALE') {
        return 'Homme';
    } else if (genderUpper === 'FEMALE') {
        return 'Femme';
    } else if (genderUpper === 'OTHER') {
        return 'Autre';
    } else if (genderUpper === 'UNKNOWN') {
        return 'Inconnu';
    } else if (genderUpper === '') {
        return 'Non spécifié';
    } else {
        return gender;
    }
}

export const formatVaccine = (vaccineCode: string) => {
    if (vaccineCode === '208' || vaccineCode === '217') {
        return 'Pfizer-BioNTech: Comirnaty';
    } else if (vaccineCode === '218' || vaccineCode === '219') {
        return 'Pfizer-BioNTech: Comirnaty (5-12 ans)';
    } else if (vaccineCode === '207') {
        return 'Moderna: Spikevax';
    } else if (vaccineCode === '210') {
        return 'AstraZeneca: Vaxzevria';
    } else if (vaccineCode === '211') {
        return 'Novavax';
    } else if (vaccineCode === '212') {
        return 'Janssen';
    } else if (vaccineCode === '213') {
        return 'Non spécifié';
    } else if (vaccineCode === '') {
        return 'Non spécifié';
    } else {
        return 'Inconnu, code: ' + vaccineCode;
    }
}

export const formatTestResult = (result: string) => {
    let resultUpper = (result ? result.toUpperCase() : '');

    if (resultUpper === 'POSITIVE') {
        return 'Positif';
    } else if (resultUpper === 'NEGATIVE') {
        return 'Négatif';
    } else if (resultUpper === 'UNKNOWN') {
        return 'Inconnu';
    } else if (resultUpper === '') {
        return 'Non spécifié';
    } else {
        return 'Inconnu, code: ' + result;
    }
}

export const formatIssuer = (issuer: string) => {
    if (issuer === 'https://covid19.quebec.ca/PreuveVaccinaleApi/issuer') {
        return 'Gouvernement du Québec';
    } else {
        return 'Émetteur inconnu';
    }
}
