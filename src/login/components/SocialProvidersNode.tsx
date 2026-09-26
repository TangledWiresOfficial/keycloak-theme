import { Button, LoginMainFooterLinksItem } from "@patternfly/react-core";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { clsx } from "keycloakify/tools/clsx";
import { KcContext } from "../KcContext.ts";
import type { ClassKey } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";

type LoginContext = Extract<KcContext, { pageId: "login.ftl" | "login-username.ftl" }>;

export default function SocialProvidersNode({
    kcContext,
    doUseDefaultCss,
    classes
}: {
    kcContext: LoginContext;
    doUseDefaultCss: boolean;
    classes?: Partial<Record<ClassKey, string>>;
}) {
    const { social, realm } = kcContext;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    return (
        realm.password &&
        social?.providers !== undefined &&
        social.providers.length !== 0 &&
        social.providers.map((...[p, , providers]) => (
            <LoginMainFooterLinksItem key={p.alias}>
                <Button
                    id={`social-${p.alias}`}
                    className={kcClsx(
                        "kcFormSocialAccountListButtonClass",
                        providers.length > 3 && "kcFormSocialAccountGridItem"
                    )}
                    variant="plain"
                    component="a"
                    href={p.loginUrl}
                    aria-label={kcSanitize(p.displayName)}
                    icon={<i className={clsx(p.iconClasses)} aria-hidden="true"></i>}
                />
            </LoginMainFooterLinksItem>
        ))
    );
}
