import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import TripCard from '../components/features/TripCard';
import ScheduleSearchBar from '../components/features/ScheduleSearchBar';
import '../App.css';

const API_BASE_URL = 'http://127.0.0.1:5000/api/schedule'; // này là IP của máy t mới chạy dc, ae ai lỗi thì thay lại bằng localhost nha

export default function SchedulePage() {
    const location = useLocation();
    const initialDate = useMemo(() => new Date().toISOString().split('T')[0], []);
    const [stations, setStations] = useState([]);
    const [stationsLoading, setStationsLoading] = useState(true);
    
    // Khôi phục state từ navigation nếu có
    const restoredState = location.state?.searchState;
    const [searchParams, setSearchParams] = useState(restoredState?.searchParams || {
        station_id: '',
        date: initialDate,
    });
    
    // Store search results - khôi phục từ state nếu có
    const [trips, setTrips] = useState(restoredState?.trips || []);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Filter state - khôi phục từ state nếu có
    const [filters, setFilters] = useState(restoredState?.filters || {
        vehicleType: 'all',
        sortBy: 'time',
    });

    // Fetch trips from backend
    const performSearch = useCallback(async (stationId, date) => {
        if (!stationId || !date) {
            return;
        }

        setLoading(true);
        setErrorMessage('');
        try {
            const params = new URLSearchParams({ station_id: stationId, date });
            const response = await fetch(`${API_BASE_URL}/trips?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to load trips');
            }
            const payload = await response.json();
            setTrips(payload.data ?? []);
        } catch (error) {
            console.error('Unable to fetch trips', error);
            setTrips([]);
            setErrorMessage('Unable to load trips. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load stations on mount
    useEffect(() => {
        const fetchStations = async () => {
            setStationsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/stations`);
                if (!response.ok) {
                    throw new Error('Failed to load stations');
                }
                const payload = await response.json();
                const list = payload.data ?? [];
                setStations(list);

                // Nếu có restored state, không cần fetch lại trips
                if (restoredState?.trips && restoredState.trips.length > 0) {
                    return;
                }

                const fallbackStation = list[0]?.station_id;
                if (fallbackStation) {
                    let targetStation = fallbackStation;
                    setSearchParams((prev) => {
                        if (prev.station_id) {
                            targetStation = prev.station_id;
                            return prev;
                        }
                        return { ...prev, station_id: fallbackStation };
                    });
                    await performSearch(targetStation, initialDate);
                }
            } catch (error) {
                console.error('Unable to fetch stations', error);
                setErrorMessage('Unable to load stations. Please refresh the page.');
            } finally {
                setStationsLoading(false);
            }
        };

        fetchStations();
    }, [performSearch, initialDate, restoredState]);

    const handleParamChange = useCallback((field, value) => {
        setSearchParams((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleSearch = (e) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        performSearch(searchParams.station_id, searchParams.date);
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));
    };

    // Filtering and sorting logic memoized for performance
    const filteredTrips = useMemo(() => {
        let result = [...trips];

        if (filters.vehicleType !== 'all') {
            result = result.filter((trip) => trip.vehicle_type === filters.vehicleType);
        }

        if (filters.sortBy === 'price') {
            result.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else {
            // Default sorting by departure time
            result.sort((a, b) => (a.time_start || '').localeCompare(b.time_start || ''));
        }

        return result;
    }, [trips, filters]);

    return (
        <>
            <Header />
            <div className="schedule-page">
                {/* 1. SEARCH BAR & FILTERS (Sticky Header) */}
                <div className="schedule-header">
                    <div className="container schedule-controls">
                        <ScheduleSearchBar
                            stations={stations}
                            searchParams={searchParams}
                            onParamsChange={handleParamChange}
                            onSubmit={handleSearch}
                            loading={loading}
                            stationsLoading={stationsLoading}
                        />

                        {/* Quick filters */}
                        <div className="filters-inline">
                            <span>Filter:</span>
                            <select
                                value={filters.vehicleType}
                                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                            >
                                <option value="all">All vehicle types</option>
                                <option value="Sleeper">Sleeper</option>
                                <option value="Seater">Seater</option>
                                <option value="Limousine">Limousine</option>
                            </select>

                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <option value="time">Earliest departure</option>
                                <option value="price">Lowest fare</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. RESULT LIST */}
                <div className="container results-body">
                    <div className="results-status">
                        {loading ? (
                            <p>Loading data...</p>
                        ) : errorMessage ? (
                            <p>{errorMessage}</p>
                        ) : (
                            <p>Found <strong>{filteredTrips.length}</strong> matching trips</p>
                        )}
                    </div>

                    <div className="trip-list-grid">
                        {filteredTrips.map((trip) => {
                            const available = trip.available_seats ?? 0;
                            return (
                                <TripCard
                                    key={trip.trip_id}
                                    trip={trip}
                                    availableSeats={available}
                                    priceLabel={formatCurrency(trip.price)}
                                    searchState={{
                                        searchParams,
                                        trips,
                                        filters
                                    }}
                                />
                            );
                        })}

                        {!loading && filteredTrips.length === 0 && (
                            <div className="empty-state">
                                <p>No matching trips were found. Please pick another date.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}