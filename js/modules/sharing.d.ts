interface SocialPlatform {
    name: string;
    icon: string;
    color: string;
    shareUrl: string;
}
declare class SocialShare {
    private platforms;
    constructor();
    private init;
    private getPageMetadata;
    private getMetaContent;
    private generateShareUrl;
    share(platformName: string): void;
    copyLink(): Promise<boolean>;
    private showToast;
    createShareButtons(containerId: string): void;
    getPlatforms(): SocialPlatform[];
}
declare const socialShare: SocialShare;
export default socialShare;
