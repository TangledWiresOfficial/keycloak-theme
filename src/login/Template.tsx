import { useEffect, useState } from "react";
import { clsx } from "keycloakify/tools/clsx";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";
import { Alert, Dropdown, DropdownItem, DropdownList, LoginPage, MenuToggle, MenuToggleElement } from "@patternfly/react-core";
import * as React from "react";
import LogoDark from "./assets/logo_dark.svg";
import LogoLight from "./assets/logo_light.svg";
import { useTheme } from "../useTheme";
import { useStyle } from "../useStyle";

import "@patternfly/react-core/dist/styles/base.css";

export default function Template(props: TemplateProps<KcContext, I18n>) {
    const theme = useTheme();
    useStyle();

    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName || realm.name);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    return (
        <LoginPage
            loginTitle={msgStr("loginAccountTitle")}
            brandImgSrc={theme === "dark" ? LogoDark : LogoLight}
            socialMediaLoginContent={socialProvidersNode}
            signUpForAccountMessage={displayInfo && infoNode}
            headerUtilities={
                enabledLanguages.length > 1 && (
                    <Dropdown
                        isOpen={langDropdownOpen}
                        onOpenChange={setLangDropdownOpen}
                        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                            <MenuToggle ref={toggleRef} onClick={() => setLangDropdownOpen(!langDropdownOpen)} isExpanded={langDropdownOpen}>
                                {currentLanguage.label}
                            </MenuToggle>
                        )}
                    >
                        <DropdownList>
                            {enabledLanguages.map(({ languageTag, label, href }, i) => (
                                <DropdownItem key={languageTag} role="none">
                                    <a role="menuitem" id={`language-${i + 1}`} className={kcClsx("kcLocaleItemClass")} href={href}>
                                        {label}
                                    </a>
                                </DropdownItem>
                            ))}
                        </DropdownList>
                    </Dropdown>
                )
            }
        >
            {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
            {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                <Alert title={<div dangerouslySetInnerHTML={{ __html: kcSanitize(message.summary) }} />} variant={message.type === "error" ? "danger" : message.type} />
            )}
            <header className={kcClsx("kcFormHeaderClass")}>
                {(() => {
                    const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? undefined : (
                        <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                            <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                            <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                <div className="kc-login-tooltip">
                                    <i className={kcClsx("kcResetFlowIcon")}></i>
                                    <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                </div>
                            </a>
                        </div>
                    );

                    if (displayRequiredFields) {
                        return (
                            <div className={kcClsx("kcContentWrapperClass")}>
                                <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                    <span className="subtitle">
                                        <span className="required">*</span>
                                        {msg("requiredFields")}
                                    </span>
                                </div>
                                <div className="col-md-10">{node}</div>
                            </div>
                        );
                    }

                    return node;
                })()}
            </header>
            <div id="kc-content">
                <div id="kc-content-wrapper">
                    {auth !== undefined && auth.showTryAnotherWayLink && (
                        <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                            <div className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" name="tryAnotherWay" value="on" />
                                <a
                                    href="#"
                                    id="try-another-way"
                                    onClick={event => {
                                        document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                        event.preventDefault();
                                        return false;
                                    }}
                                >
                                    {msg("doTryAnotherWay")}
                                </a>
                            </div>
                        </form>
                    )}
                </div>
            </div>
            {children}
        </LoginPage>
    );
}
