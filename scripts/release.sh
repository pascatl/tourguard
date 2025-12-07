#!/bin/bash

# TourGuard Release Script
# Erstellt semantische Versionstags für automatisches Testen und Release-Build

set -e

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funktion für Hilfe
show_help() {
    echo -e "${BLUE}TourGuard Release Script${NC}"
    echo ""
    echo "Usage: ./scripts/release.sh [VERSION_TYPE]"
    echo ""
    echo "VERSION_TYPE:"
    echo "  major     - Neue Hauptversion (v1.0.0 -> v2.0.0)"
    echo "  minor     - Neue Feature-Version (v1.0.0 -> v1.1.0)"
    echo "  patch     - Bugfix-Version (v1.0.0 -> v1.0.1)"
    echo "  [v0.0.0]  - Spezifische Version (z.B. v1.2.3)"
    echo ""
    echo "Beispiele:"
    echo "  ./scripts/release.sh patch"
    echo "  ./scripts/release.sh minor"
    echo "  ./scripts/release.sh v1.2.3"
    echo ""
    echo "Der Script erstellt automatisch einen Git-Tag und pusht ihn,"
    echo "was Tests und Release-Build über GitHub Actions auslöst."
}

# Prüfen ob wir in einem Git-Repository sind
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Fehler: Nicht in einem Git-Repository${NC}"
    exit 1
fi

# Prüfen ob alle Änderungen committed sind
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Fehler: Es gibt uncommittete Änderungen${NC}"
    echo "Bitte committen Sie alle Änderungen vor dem Release:"
    git status --porcelain
    exit 1
fi

# Parameter prüfen
if [ $# -eq 0 ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_help
    exit 0
fi

VERSION_TYPE=$1

# Aktuelle Version ermitteln
CURRENT_VERSION=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
echo -e "${BLUE}📋 Aktuelle Version: ${CURRENT_VERSION}${NC}"

# Version berechnen
if [[ "$VERSION_TYPE" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    # Spezifische Version angegeben
    NEW_VERSION=$VERSION_TYPE
elif [ "$VERSION_TYPE" = "major" ] || [ "$VERSION_TYPE" = "minor" ] || [ "$VERSION_TYPE" = "patch" ]; then
    # Automatische Versionierung
    if [[ "$CURRENT_VERSION" =~ ^v([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
        MAJOR=${BASH_REMATCH[1]}
        MINOR=${BASH_REMATCH[2]}
        PATCH=${BASH_REMATCH[3]}
        
        case $VERSION_TYPE in
            "major")
                NEW_VERSION="v$((MAJOR + 1)).0.0"
                ;;
            "minor")
                NEW_VERSION="v${MAJOR}.$((MINOR + 1)).0"
                ;;
            "patch")
                NEW_VERSION="v${MAJOR}.${MINOR}.$((PATCH + 1))"
                ;;
        esac
    else
        echo -e "${RED}❌ Fehler: Ungültiges aktuelles Versionsformat: $CURRENT_VERSION${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Fehler: Ungültiger Versionstyp: $VERSION_TYPE${NC}"
    show_help
    exit 1
fi

echo -e "${GREEN}🎯 Neue Version: ${NEW_VERSION}${NC}"

# Bestätigung
echo ""
read -p "$(echo -e "${YELLOW}Soll Version ${NEW_VERSION} erstellt werden? (y/N): ${NC}")" -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Abgebrochen${NC}"
    exit 0
fi

# Package.json Versionen aktualisieren (falls vorhanden)
if [ -f "frontend/package.json" ]; then
    echo -e "${BLUE}📦 Aktualisiere Frontend package.json...${NC}"
    # Version ohne 'v' Prefix für package.json
    VERSION_NUMBER=${NEW_VERSION#v}
    sed -i "s/\"version\": \".*\"/\"version\": \"${VERSION_NUMBER}\"/" frontend/package.json
fi

if [ -f "backend/package.json" ]; then
    echo -e "${BLUE}📦 Aktualisiere Backend package.json...${NC}"
    VERSION_NUMBER=${NEW_VERSION#v}
    sed -i "s/\"version\": \".*\"/\"version\": \"${VERSION_NUMBER}\"/" backend/package.json
fi

# Änderungen committen (falls package.json aktualisiert wurde)
if git diff-index --quiet HEAD --; then
    echo -e "${BLUE}📝 Keine package.json Änderungen zu committen${NC}"
else
    echo -e "${BLUE}📝 Committe package.json Änderungen...${NC}"
    git add frontend/package.json backend/package.json 2>/dev/null || true
    git commit -m "🔖 Bump version to ${NEW_VERSION}" || true
fi

# Git Tag erstellen
echo -e "${BLUE}🏷️  Erstelle Git Tag...${NC}"
git tag -a "$NEW_VERSION" -m "Release $NEW_VERSION

$(git log --oneline $(git describe --tags --abbrev=0 HEAD^ 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD 2>/dev/null || echo "Initial release")"

# Tag pushen
echo -e "${BLUE}🚀 Pushe Tag und löse Release-Build aus...${NC}"
git push origin "$NEW_VERSION"

# Auch main branch pushen (falls package.json geändert wurde)
if ! git diff-index --quiet HEAD~1 HEAD 2>/dev/null; then
    echo -e "${BLUE}📤 Pushe main branch...${NC}"
    git push origin main
fi

echo ""
echo -e "${GREEN}✅ Release ${NEW_VERSION} erfolgreich erstellt!${NC}"
echo ""
echo -e "${BLUE}🔗 GitHub Actions Workflow:${NC}"
echo "   https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\(.*\)\.git.*/\1/')/actions"
echo ""
echo -e "${BLUE}📋 Was passiert jetzt:${NC}"
echo "   1. GitHub Actions läuft automatisch"
echo "   2. Frontend und Backend Tests werden ausgeführt"
echo "   3. Bei erfolgreichen Tests wird ein Release-Build erstellt"
echo "   4. Ein GitHub Release wird mit dem Build-Archiv erstellt"
echo ""
echo -e "${YELLOW}💡 Tipp: Verfolgen Sie den Build-Fortschritt im GitHub Actions Tab${NC}"