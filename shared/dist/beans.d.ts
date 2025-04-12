export declare namespace BeansAI {
    type ItemId = {
        listItemId: string;
        route: RouteId;
    };
    type ItemIdList = {
        item: ItemId[];
    };
    interface ItemList {
        item: Item[];
    }
    interface Dimensions {
        length: number;
        width: number;
        height: number;
    }
    interface RouteList {
        route: Route[];
    }
    interface Route {
        listRouteId: string;
        name: string;
        dateStr: string;
        status: 'OPEN' | 'CLOSED';
        assignee?: Assignee;
        warehouse?: Warehouse;
        updatedAt: number;
        accountBuid: string;
        createdAt: string;
        routePathMd5: string;
        routeType: 'DEFAULT' | 'TEMPLATE';
        startMode: 'warehouse' | 'custom' | 'first_stop';
        endMode: 'warehouse' | 'custom' | 'anywhere';
    }
    interface Assignee {
        listAssigneeId: string;
        name: string;
        email?: string;
        phone?: string;
        state: 'ACTIVE' | 'DISABLED';
        role: 'OWNER' | 'MANAGER' | 'DRIVER';
        latitude?: number;
        longitude?: number;
        positionsUpdatedAtMillis?: number;
        updatedAt: number;
    }
    interface Warehouse {
        listWarehouseId: string;
        address: string;
        formattedAddress?: string;
        position?: LatLng;
        updatedAt: number;
    }
    interface LatLng {
        latitude: number;
        longitude: number;
    }
    type AddressComponents = {
        city: string;
        state: string;
        zipcode: string;
        street: string;
        countryIso3: string;
    };
    type IconColorSet = {
        default: {
            default: string;
            selected: string;
            type: string;
        };
    };
    type RouteId = {
        listRouteId: string;
    };
    type Item = {
        listItemId: string;
        route?: Route;
        type: 'DROPOFF' | 'PICKUP';
        address: string;
        formattedAddress?: string;
        unit?: string;
        skipGeocoder?: boolean;
        position?: LatLng;
        customerName?: string;
        customerPhone?: string;
        notes?: string;
        trackingId?: string;
        numPackages?: number;
        dimensions?: Dimensions;
        status: 'NEW' | 'FINISHED' | 'FAILED' | 'NOLOCATION';
        statusUpdatedAt?: number;
        stopTimeSeconds?: number;
        flavors?: string;
        updatedAt: number;
        signatureRequired?: boolean;
        createdAt: number;
        routePriority: number;
        displayPosition: LatLng;
        deliverFromStr: string;
        addressComponents: AddressComponents;
        origination: string;
        sourceSeq: number;
        thirdPartyReferenceId: string;
        extraInfo1: string;
        iconId: string;
        iconColorSet: IconColorSet;
    };
    type Log = {
        listItemId: string;
        listRouteId: string;
        accountBuid: string;
        status: string;
        trackingId: string;
        type: string;
        tsMillis: number;
    };
    type Pod = {
        listItemId: string;
        listRouteId: string;
        accountBuid: string;
        timestampEpochSecond: number;
        images: {
            url: string;
            type: string;
        }[];
        eventCode: {
            code: string;
            name: string;
        };
        positionType: string;
        generatedFrom: string;
        generatedBy: string;
        consigneeName: string;
        tags: {
            key: string;
            value: string;
        }[];
        ts: number;
    };
    type StatusLog = {
        tsMillis: number;
        type: string;
        description: string;
        item: Item;
        log: Log;
        pod?: Pod;
    };
    type ListItemReadableStatusLogs = StatusLog[];
}
