import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

export function initialAdmob() {
    mobileAds()
        .setRequestConfiguration({
            maxAdContentRating: MaxAdContentRating.PG,
            tagForChildDirectedTreatment: true,
            tagForUnderAgeOfConsent: true,
            testDeviceIdentifiers: ['EMULATOR'],
        })
        .then(() => {
            mobileAds()
                .initialize()
                .then(adapterStatuses => {
                    // Initialization complete!
                });
        });
}